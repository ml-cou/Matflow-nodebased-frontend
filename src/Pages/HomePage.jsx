import React from "react";
import { Link } from "react-router-dom";
import feature_img from "./Feature_collage.svg";

function HomePage() {
  return (
    <div className="">
      {/* First Section */}
      <div className="flex flex-col md:flex-row lg:max-w-[1400px] mx-auto gap-12 pt-4 md:pt-14 px-8">
        <div className="flex order-2 md:order-1 flex-col w-1/2 justify-center">
          <h1 className="font-bold text-3xl lg:text-4xl mb-10">
            Machine Learning and Data Analytic with{" "}
            <span className="text-primary-btn underline">
              Zero Line Of Code
            </span>
          </h1>
          <p className="text-md lg:text-lg">
            Matflow, the ultimate destination for machine learning and data
            analytics. Explore cutting-edge techniques, discover powerful tools,
            and stay up-to-date with the latest advancements in the field.
            Unleash the full potential of your data with Matflow.
          </p>
          <div className="mt-10 flex gap-8">
            <button className="cursor-pointer bg-primary-btn px-6 py-4 rounded-md hover:translate-x-0 hover:translate-y-[-3px] hover:shadow-accent hover:shadow-[0px_20px_80px_-10px] duration-150 font-medium">
              <Link to={"/editor"}>Get Started</Link>
            </button>
            <button className="cursor-pointer bg-secondary-btn px-6 py-4 rounded-md hover:translate-x-0 font-medium hover:translate-y-[-3px] shadow-sm duration-150">
              Request A Demo
            </button>
          </div>
        </div>
        <div className="order-1 md:order-2 w-1/2">
          <img
            src="/iso-ai.jpg"
            alt=""
            className="w-full max-h-[700px] h-full object-contain object-center"
          />
        </div>
      </div>

      {/* Second Section */}
      <div className="mt-16 lg:max-w-[1200px] mx-auto text-center px-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">
            A Complete Platform for Machine Learning
          </h1>
          <p className="text-xl">
            Find solutions to accelerate machine learning tasks with zero
            knowledge of code.
          </p>
        </div>
        <div className="flex align-middle justify-around mt-6 flex-wrap">
          <div className="border border-gray-300 shadow-md py-4 mt-4 px-4 flex flex-col items-center rounded gap-3">
            <div>
              <img src="/field-of-view.png" alt="" className="w-28 h-full max-h-28" />
            </div>
            <h3 className="font-medium text-text text-xl">Model & Visualize</h3>
            <p className="max-w-xs font-light">Harness the power of machine learning algorithms to build accurate models, and visualize your data like never before. Uncover insights and make informed decisions with Matflow.</p>
          </div>
          <div className="flex flex-col border border-gray-300 shadow-md py-4 mt-4 px-4 items-center rounded gap-3">
            <div>
              <img src="/translator.png" alt="" className="w-28 h-full max-h-28" />
            </div>
            <h3 className="font-medium text-text text-xl">Blend & Transform</h3>
            <p className="max-w-xs font-light">Unlock the power of data manipulation and transformation. Seamlessly blend datasets, apply powerful transformations, and extract valuable insights to enhance your machine learning and data analysis workflows.</p>
          </div>
          <div className="flex flex-col border border-gray-300 shadow-md py-4 mt-4 px-4 items-center rounded gap-3">
            <div>
              <img src="/analysis.png" alt="" className="w-28 h-full max-h-28" />
            </div>
            <h3 className="font-medium text-text text-xl">Predicative Analysis</h3>
            <p className="max-w-xs font-light">Dive into the world of advanced analytics and forecasting. Harness the power of data-driven insights to make accurate predictions and drive informed decision-making.</p>
          </div>
          <div className="flex flex-col border border-gray-300 shadow-md py-4 mt-4 px-4 items-center rounded gap-3">
            <div>
              <img src="/presentation.png" alt="" className="w-28 h-full max-h-28" />
            </div>
            <h3 className="font-medium text-text text-xl">Time Series Forecasting</h3>
            <p className="max-w-xs font-light">Dive into the world of time series forecasting on Matflow. Unlock insights from temporal data, leverage advanced algorithms, and make accurate predictions for future trends and patterns. Master the art of forecasting with Matflow.</p>
          </div>
        </div>
      </div>

      {/* Third Section */}
      <div className="mt-20 bg-secondary-btn">
        <div className="max-w-[1200px] mx-auto px-8 pt-16 pb-8">
          <h1 className="font-bold text-3xl mb-6">
            A MACHINE LEARNING BASED DATA ANALYSIS AND EXPLORATION SYSTEM FOR
            MATERIAL DESIGN
          </h1>
          <p className="font-light mb-8">
            MatFlow is a web-based dataflow framework for visual data
            exploration. A machine learning-based data analysis and exploration
            system for material design is a computer system that uses machine
            learning algorithms to analyze and explore large amounts of material
            design data. This system can be used to identify patterns and
            relationships in the data, generate insights and predictions, and
            support decision-making in the field of material design. The system
            can be trained on existing data to improve its accuracy and can also
            be updated with new data as it becomes available to continue
            learning and improving its performance.
          </p>
          <img src={feature_img} alt="" className="w-full h-full" />
        </div>
      </div>

      {/* Fourth Section */}
      <div className="mt-16 p-16">
        <div className="text-center">
          <h1 className="font-bold text-4xl mb-4">Get started today.</h1>
          <div>
            <button className="cursor-pointer px-6 py-4 bg-primary-btn rounded shadow mr-6">
              <Link to={"/register"}>Create Free Account</Link>
            </button>
            <button className="cursor-pointer py-2 shadow border-b-2 border-primary-btn">
              <Link to={"/contact-us"}>Contact Us</Link>
            </button>
          </div>
        </div>
      </div>

      {/* Fifth Section */}
      {/* <div>
        <h1>Technologies We Used</h1>
        <div>
          <img src="/jupyter.png" alt="" />
        </div>
      </div> */}
    </div>
  );
}

export default HomePage;
