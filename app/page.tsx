'use client';  

import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="container">
      <nav className="navbar">
        <h1>Veterinary Clinic Management</h1>
      </nav>

      <div className="button-container">
        <Link href="/medicine" passHref>
          <button className="btn">Go to Medicine Management</button>
        </Link>
        <Link href="/prescription" passHref>
          <button className="btn">Go to Prescription Management</button>
        </Link>
        <Link href="/treatment" passHref>
          <button className="btn">Go to Treatment Management</button>
        </Link>
      </div>

      <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          padding: 20px;
          background-color: #f4f4f4;
          color: #333;
          text-align: center;
        }

        .navbar {
          background-color: #222;
          color: #fff;
          padding: 10px;
          margin-bottom: 30px;
        }

        .button-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .btn {
          background-color: #333;
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 16px;
          cursor: pointer;
          width: 100%;
        }

        .btn:hover {
          background-color: #444;
        }

        @media (min-width: 600px) {
          .button-container {
            flex-direction: row;
            justify-content: center;
            gap: 40px;
          }

          .btn {
            width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
