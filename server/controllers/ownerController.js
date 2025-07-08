import imagekit from "../configs/imagekit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";
//api to change role of user
export const changeRoleToOwner = async (req, res)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id,{role: "owner"})
        res.json({success:true, message: "Now you can list cars"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: "error.message"})
    }

}

//api to list car

export const addCar = async(req , res)=>{
    try {
        const {_id} = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        const fileBuffer = fs.readFileSync(imageFile.path)//upload image to imagekit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        })
        // For URL Generation, works for both images and videos
        var optimizedImageURL = imagekit.url({
            path : response.filePath,
            transformation : [
                {width : '1280'}, //width resizing
                {quality : 'auto'}, //auto compression
                {format : 'webp'} //convert to modern format 
            ]
        });

        const image = optimizedImageURL;
        await Car.create({...car, owner: _id, image})

        res.json({success:true, message:"Car Added"})



    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: "error.message"})
    }
}

//api to list owner cars

export const getOwnerCars = async(req, res)=>{
    try {
        const {_id} = req.user;
        const cars = await Car.find({owner: _id})
        res.json({success:true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: "error.message"})
    }
}

//api to toggle car availability

export const toggleCarAvailability = async(req,res) =>{
    // console.log(req?.user?._id)
    // console.log("ToggleCaravilability is called")
    
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)
        // console.log(car)
        

        //checking if car belongs to user
        if(car?.owner?.toString()!==_id.toString()){
            return res.json({success:false, message: "Unauthorized"})
        }
        car.isAvailable = !car.isAvailable;
        await car.save()

        res.json({success:true, message: "Availability Toggled"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: "error.message"})
    }
}

//api to delete a car

export const deleteCar = async(req,res) =>{
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        //checking if car belongs to user
        if(car.owner.toString()!==_id.toString()){
            return res.json({success:false, message: "Unauthorized"})
        }
        car.owner = null;
        car.isAvailable = false;
        await car.save()

        res.json({success:true, message: "Car Removed"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: "error.message"})
    }
}

//api to get dashboard data
export const getDashboardData = async (req,res) =>{
    try {
        const {_id,role} = req.user;

        if(role !== 'owner'){
            return res.json({success:false, message: "Unauthorized"})
        
        }

        const cars = await Car.find({owner:_id})
        const bookings = await Booking.find({owner: _id}).populate('car').sort({createdAt: -1})

        const pendingBookings = await Booking.find({owner: _id, status: "pending"})
        const completedBookings = await Booking.find({owner: _id, status: "confirmed"})

        //calculate monthly revenue from bookings where status is confirmed
        // Calculate monthly revenue from confirmed bookings
        const monthlyRevenue = bookings
        .filter(booking => booking.status === 'confirmed')
        .reduce((acc, booking) => acc + booking.price, 0);

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue
        }

        res.json({ success: true, dashboardData });


    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: "error.message"})
    }
}

//API to update user image

export const updateUserImage = async(req, res) =>{
    try {
        const {_id} = req.user;

        const imageFile = req.file;

        const fileBuffer = fs.readFileSync(imageFile.path)//upload image to imagekit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        })
        // For URL Generation, works for both images and videos
        var optimizedImageURL = imagekit.url({
            path : response.filePath,
            transformation : [
                {width : '400'}, //width resizing
                {quality : 'auto'}, //auto compression
                {format : 'webp'} //convert to modern format 
            ]
        });

        const image = optimizedImageURL;
        await User.findByIdAndUpdate(_id, {image});
        res.json({success:true, message: "Image Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false, message: "error.message"})
    }
}