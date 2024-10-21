"use client"
import React, { useEffect, useState } from 'react';
import { AsciiBG } from '@/components/asciirenderer/AsciiExamples';
import Head from 'next/head';
import { Footer } from '@/components/footer';

const Home = () => {


  return (
    <>
      <Head>
        <title>qliphoth:systems</title>
      </Head>
      <AsciiBG />
      <Footer />

    </>
  );
};
export default Home;