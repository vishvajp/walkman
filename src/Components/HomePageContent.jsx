import React from "react";
import Typewriter from "typewriter-effect";
import banner3 from "../Assets/images/homebanner1.jpg";
import banner2 from "../Assets/images/homebanner2.jpg";
import banner1 from "../Assets/images/homebanner3.jpg";
import "../Css/HomepageContent.css";

const HomePageContent = () => {
  return (
    <div>
      <div
        id="carouselExampleIndicators"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-wrap="true"
        // data-bs-interval="3000"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="0"
            className="active"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to="2"
          ></button>
        </div>

        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              className="d-block w-100 carousel-img-height"
              src={banner1}
              alt="First slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5 className="carousel-caption-h5">WELCOME TO IWWGROUPS</h5>
              <h1>
                <Typewriter
                  options={{
                    strings: ["Teamwork Leads to Success."],
                    autoStart: true,
                    loop: true,
                    delay: 75, // controls the speed of the typing animation
                    deleteSpeed: 50, // controls the speed of deleting text (if used in looping mode)
                    // customize the cursor
                  }}
                />
              </h1>
            </div>
          </div>
          <div className="carousel-item">
            <img
              className="d-block w-100 carousel-img-height"
              src={banner2}
              alt="Second slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5 className="carousel-caption-h5">WELCOME TO IWWGROUPS</h5>
              <h1>
                <Typewriter
                  options={{
                    strings: ["Quality is Everyone's Responsibility"],
                    autoStart: true,
                    loop: true,
                    delay: 75, // controls the speed of the typing animation
                    deleteSpeed: 50, // controls the speed of deleting text (if used in looping mode)
                    // customize the cursor
                  }}
                />
              </h1>
            </div>
          </div>
          <div className="carousel-item">
            <img
              className="d-block w-100 carousel-img-height"
              src={banner3}
              alt="Third slide"
            />
            <div className="carousel-caption d-none d-md-block">
              <h5 className="carousel-caption-h5">WELCOME TO IWWGROUPS</h5>
              <h1>
                <Typewriter
                  options={{
                    strings: ['"The Heart & Soul of this Company""Creativity and Innovation"'],
                    autoStart: true,
                    loop: true,
                    delay: 75, // controls the speed of the typing animation
                    deleteSpeed: 50, // controls the speed of deleting text (if used in looping mode)
                    // customize the cursor
                  }}
                />
              </h1>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          href="#carouselExampleIndicators"
          role="button"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default HomePageContent;
