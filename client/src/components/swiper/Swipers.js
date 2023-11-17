import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

import "./swiper.css";

// import required modules
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper";


const Swipers = () => {
  return (
    <>
      <div>
        <Swiper
          spaceBetween={30}
          effect={"fade"}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[EffectFade, Navigation, Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <img style={{height:"90vh", width:"100%"}} src="/animation.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img style={{height:"90vh", width:"100%"}} src="/paint.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img style={{height:"90vh", width:"100%"}} src="/backdrop.jpg" />
          </SwiperSlide>
          <SwiperSlide>
          <img style={{height:"90vh", width:"100%"}} src="/backdrop.jpg" />
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  )
}

export default Swipers