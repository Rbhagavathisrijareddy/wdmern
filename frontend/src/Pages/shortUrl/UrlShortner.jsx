import React from 'react'
import { Stack, TextInput,Button, CopyButton } from '@mantine/core';
import { useState } from 'react';
import { useEffect } from 'react';
import Service from '../../utils/http';
import QRCode from 'react-qr-code';

export const UrlShortner = () => {
    const service = new Service()
    const [data, setData] = useState({ });
    const [shortUrl, setShortUrl] = useState("")

    const handleSubmit = async () => {
        try {
            const response = await service.post('s', data)
            console.log("POST API call successful!", response);
            setShortUrl(`https://url-shortener-bootcamp.onrender.com/api/s/${response.shortCode}`);
        } catch (error) {
           console.error("POST API call failed!", error.message);
       }


    };
    useEffect(() => {
        console.log(`Short URL is ${shortUrl}`);
   }, [shortUrl])

return (
  <>
    {shortUrl && shortUrl.length > 0 ? (
      <>
        <p>{shortUrl}</p>
        <CopyButton value={shortUrl}>
      {({ copied, copy }) => (
        <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
          {copied ? 'Copied url' : 'Copy url'}
        </Button>
      )}
    </CopyButton>
        <div style={{ height: "auto", margin: "0 auto", maxWidth: 250, width: "100%" }}>
          <QRCode
            size={500}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={shortUrl}
            viewBox={`0 0 256 256`}
          />
</div>
      </>
    ) : 
      <Stack>
    <TextInput
      size="md"
      label="Original URL"
      withAsterisk
      placeholder="Enter the original URL here"
      onChange={(event) => setData({ ...data, originalUrl: event.target.value })}
    />
    <TextInput
        size="md"
        label="Custom the Url(opt)"
        placeholder="Enter the custom URL here"
        onChange={(event) => setData({ ...data, customUrl: event.target.value })}
        />
    <TextInput
        size="md"
        label="Title(opt)"
        placeholder="Enter the title here"
        onChange={(event) => setData({ ...data, title: event.target.value })}
        />
    <Button
      variant="gradient"
      gradient={{ from: 'grape', to: 'yellow', deg: 69 }}
      onClick={handleSubmit}

    >
      Shorten URL
        </Button>
    </Stack>
    }   
    </>
  );
}

export default UrlShortner
