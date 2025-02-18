import React from "react";
import product1 from "../Assets/images/product1.jpg";
import hatIcon from "../Assets/images/ser-1.png";
import "../Css/About.css"
const About = () => {
  return (
    <div>
      <div className="row mt-5">
        <div className="col-2"></div>
        <div className="col-8">
          <div className="row product-row">
            <div className="col-12 col-lg-6 p-0">
              <div className="product-div">
                <img className="product-img" src={product1} style={{width:"100%"}}></img>
                <img className="setting-icon" src={hatIcon}></img>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="d-flex flex-column p-4">
                <h3>
                  <span style={{ color: "red" }}>WHO WE </span>{" "}
                  ARE
                </h3>
                <p className="about-page-p-tag mb-0">
                  IWW group of companies, the real game changer in pipeline
                  precommissioning, mechanical services, welding solutions,
                  fabrication, ship repairs and construction services. Imagine a
                  world where your projects are completed on time, within
                  budget, and without the usual hiccups. With our cutting-edge
                  welding solutions and expert fabrication, we bring speed and
                  quality together like never before. Our skilled manpower
                  equips you with the right team to tackle any challenge. We
                  don’t just meet industry standards we set them!<br>
                  </br> Join IWW group
                  of companies and experience a seamless pipeline service
                  revolution. Don’t just dream about efficiency make it your new
                  reality today!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-2"></div>
      </div>
    </div>
  );
};

export default About;
