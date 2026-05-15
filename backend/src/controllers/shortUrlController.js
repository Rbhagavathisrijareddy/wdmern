import { ShortURL } from "../models/shorturl.model.js";
import { nanoid } from 'nanoid'
export const createShortUrl = async (req, res) => {
   const { originalUrl, title, customUrl } = req.body;
   if (!originalUrl) {
       return res.status(400).json({ message: "original URL is required" });
   }
   try {
       let shortCode;
       if (customUrl) {
           const present = await ShortURL.findOne({ shortCode: customUrl });
           console.log(present);
           if (present) {
               return res.status(400).json({ message: "Please enter a different custom IR:" });
           }
           shortCode = customUrl;
       }
       else {
           shortCode = nanoid(7);
           let present = await ShortURL.findOne({ shortCode });
           while (present) {
               shortCode = nanoid(7);
               present = await ShortURL.findOne({ shortCode });
           }
       }
       const newUrl = await ShortURL.create({
           originalUrl,
           shortCode,
           title,
           userId: req.user.id
       });
       return res.status(200).json(newUrl);
   } catch (error) {
       return res.status(500).json({ message: "Internal Server Error" });
   }
}
//controller for retreiving the short url details

// export const getShortUrlDetails = async (req, res) => {
//     try {
//         const { shortCode } = req.params;
//         const record = await ShortURL.findOne({ shortCode });
//         if (!record) {
//             return res.status(404).json({ message: "Invalid ShortCode" });
//         }
//         return res.status(200).json(record);
//     } catch (error) {
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// }

//controller for redirection 

export const redirectToLongUrl = async (req, res) => {
   try {
       const { shortCode } = req.params;
       const record = await ShortURL.findOne({ shortCode });
       if (!record) {
           return res.status(404).json({ message: "Invalid ShortCode" });
       }
       res.redirect(record.originalUrl);
   } catch (error) {
       return res.status(500).json({ message: "Internal Server Error" });
   }
}


export default createShortUrl;
