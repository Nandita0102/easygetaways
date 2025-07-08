import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets';
import {motion} from 'motion/react'

const Testimonial = () => {
    const testimonials = [
        { name: "Priya Varrier", 
          location: "Jabalpur, Madhya Pradesh",
          image: assets.testimonial_image_1, 
          testimonial: "I booked a Lamborghini Huracán for my birthday through Vroom, and it was worth every penny! The car arrived spotless, with a handwritten note. Felt like a celebrity!" 
        },
        { name: "Neeraja Dixit", 
          location: "Jabalpur, Madhya Pradesh",
          image: assets.testimonial_image_2, 
          testimonial: "I thought luxury rentals were all hype until I tried Vroom. Now I’m hooked—their insurance transparency and no-hidden-fees policy are just as impressive as their fleet." 
        },
        { name: "Gracie Rodriguez", 
          location: "Indore, Madhya Pradesh",
          image: assets.testimonial_image_1, 
          testimonial: "As a frequent traveler, I need reliability and style. EasyGetaways delivers both—whether it’s a Mercedes S-Class for client meetings or a Range Rover for weekend getaways. The app’s VIP support saves me hours." 
        }
        
    ];
  return (
    
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">

        <Title title= "What Our Customers Say" subTitle="Discover why wise travellers choose EasyGetaways for their luxury tarvels around the world." />
            

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
                {testimonials.map((testimonial,index) => (
                    <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.3 }}
                                                        
                    key={index} className="bg-white p-6 rounded-xl shadow-lg hover:translate-y-1 transition-all duration-500">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <img key={index} src={assets.star_icon} alt="star-icon" />
                                
                            ))}
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4 font-light">"{testimonial.testimonial}"</p>
                    </motion.div>
                ))}
            </div>
        </div>
  )
}

export default Testimonial