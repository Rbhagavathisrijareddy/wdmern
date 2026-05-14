import React, { useEffect, useState } from 'react';
import Service from '../../utils/http.js';
import {
    Button,
    Modal,
    Table,
    TextInput,
    Group,
    Pagination,
    ScrollArea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export const URLHistory = () => {
    const [opened, { open, close }] = useDisclosure(false);

    const [updatedData, setUpdatedData] = useState({
        originalUrl: '',
        title: '',
    });

    const [data, setData] = useState([]);
    const [shortCode, setShortCode] = useState('');

    // Pagination state
    const [page, setPage] = useState(1);
    const recordsPerPage = 5;

    const service = new Service();

    const fetchHistory = async () => {
        try {
            const response = await service.get('user/my/urls');
            setData(response.shortURLs || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // Paginated data
    const paginatedData = data.slice(
        (page - 1) * recordsPerPage,
        page * recordsPerPage
    );

    const handleUpdate = (element) => {
        setShortCode(element.shortCode);

        setUpdatedData({
            originalUrl: element.originalUrl,
            title: element.title || '',
        });

        open();
    };

    const updateRecord = async (shortCode, updatedData) => {
        try {
            const response = await service.patch(
                `s/${shortCode}`,
                updatedData
            );
            console.log(response);
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleSubmit = async () => {
        await updateRecord(shortCode, updatedData);
        close();
        await fetchHistory();
    };

    const handleDelete = async (shortCode) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this URL?'
        );

        if (!confirmDelete) return;

        try {
            const response = await service.delete(`s/${shortCode}`);
            console.log(response);

            await fetchHistory();

            // Adjust page if last item deleted
            const totalPages = Math.ceil(
                (data.length - 1) / recordsPerPage
            );

            if (page > totalPages && totalPages > 0) {
                setPage(totalPages);
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div>
            <ScrollArea>
                <Table highlightOnHover striped withTableBorder>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Original URL</Table.Th>
                            <Table.Th>Short Code</Table.Th>
                            <Table.Th>Click Count</Table.Th>
                            <Table.Th>Created At</Table.Th>
                            <Table.Th>Expires At</Table.Th>
                            <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((element) => (
                                <Table.Tr key={element._id}>
                                    <Table.Td>
                                        {element.originalUrl}
                                    </Table.Td>

                                    <Table.Td>
                                        {element.shortCode}
                                    </Table.Td>

                                    <Table.Td>
                                        {element.clickCount}
                                    </Table.Td>

                                    <Table.Td>
                                        {new Date(
                                            element.createdAt
                                        ).toLocaleString()}
                                    </Table.Td>

                                    <Table.Td>
                                        {new Date(
                                            element.expiresAt
                                        ).toLocaleString()}
                                    </Table.Td>

                                    <Table.Td>
                                        <Group gap="xs">
                                            <Button
                                                size="xs"
                                                radius="sm"
                                                onClick={() =>
                                                    handleUpdate(element)
                                                }
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                color="red"
                                                size="xs"
                                                radius="sm"
                                                onClick={() =>
                                                    handleDelete(
                                                        element.shortCode
                                                    )
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={6} align="center">
                                    No URL history found
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </ScrollArea>

            {/* Pagination */}
            {data.length > recordsPerPage && (
                <Group justify="center" mt="lg">
                    <Pagination
                        value={page}
                        onChange={setPage}
                        total={Math.ceil(
                            data.length / recordsPerPage
                        )}
                    />
                </Group>
            )}

            {/* Edit Modal */}
            <Modal
                opened={opened}
                onClose={close}
                title="Edit URL"
                centered
            >
                <TextInput
                    label="Enter new URL"
                    value={updatedData.originalUrl}
                    placeholder="Enter URL"
                    onChange={(e) =>
                        setUpdatedData({
                            ...updatedData,
                            originalUrl: e.target.value,
                        })
                    }
                />

                <TextInput
                    mt="md"
                    label="Enter New Title"
                    value={updatedData.title}
                    placeholder="Enter title"
                    onChange={(e) =>
                        setUpdatedData({
                            ...updatedData,
                            title: e.target.value,
                        })
                    }
                />

                <Button
                    mt="lg"
                    fullWidth
                    onClick={handleSubmit}
                >
                    Update
                </Button>
            </Modal>
        </div>
    );
};

export default URLHistory;