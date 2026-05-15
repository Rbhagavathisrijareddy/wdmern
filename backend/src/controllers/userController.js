import { User } from "../models/user/user.model.js";


export const getUserDetails = async (req, res) => {
   try {
       // console.log(req.user);
       const { id } = req.user;
       const user = await User.findById(id);
       return res.status(200).json(user);
   } catch (error) {
       return res.status(500).json({ message: "Internal Server Error" });
   }
}
