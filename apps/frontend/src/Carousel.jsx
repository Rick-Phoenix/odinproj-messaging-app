import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

export default function Carousel() {
  return (
    <div className="carousel">
      <Swiper
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        slidesPerView={1}
        A11y={true}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        modules={[Navigation, Pagination, Autoplay, A11y]}
      >
        <SwiperSlide>
          <h2>A modern app for modern needs</h2>
          <p>Seamless navigation with an intuitive (and stylish) layout</p>
          <img
            src="https://res.cloudinary.com/dqjizh49f/image/upload/v1734341610/Messaging%20App/Chat_Pic_Global.png"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          <h2>Everything you need, just a few clicks away</h2>
          <p>
            Comfortably view and manage chats, friend requests and profile
            details in one place
          </p>
          <img
            src="https://res.cloudinary.com/dqjizh49f/image/upload/v1734273626/Messaging%20App/Chat_Pic_Panel.png"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          <h2>Chatting has never been easier</h2>
          <p>Enjoy a fast and responsive chatting experience</p>
          <img
            src="https://res.cloudinary.com/dqjizh49f/image/upload/v1734273620/Messaging%20App/Chat_Pic_Convo.png"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          <h2>Support for image sharing</h2>
          <p>
            Share pictures, photographs (and memes) with your friends directly
            in your chats
          </p>
          <img
            src="https://res.cloudinary.com/dqjizh49f/image/upload/v1734273602/Messaging%20App/Chat_Pic_Imgsend.png"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          <h2>Manage and update your profile in real time</h2>
          <p>
            Or view your friends&apos; profiles to see what they&apos;re writing
            about!
          </p>
          <img
            src="https://res.cloudinary.com/dqjizh49f/image/upload/v1734273630/Messaging%20App/Chat_Pic_Profile.png"
            alt=""
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
