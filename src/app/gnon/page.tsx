"use client"
import React, { useEffect, useState } from 'react';
import { AsciiBG } from '@/components/asciirenderer/AsciiGnon';
import Head from 'next/head';
import { Footer } from '@/components/footer';
import GematriaCalculator from '@/components/gematro/GematriaCalculator';

const Home = () => {


  return (
    <>
      <Head>
        <title>gnon.ai</title>
      </Head>
      <AsciiBG />
      <GematriaCalculator />
      <Footer links={[
        {
          href: "https://explorer.solana.com/address/HeJUFDxfJSzYFUuHLxkMqCgytU31G6mjP4wKviwqpump",
          label: "HeJUFDxfJSzYFUuHLxkMqCgytU31G6mjP4wKviwqpump"
        },
        {
          href: "https://dexscreener.com/solana/2ur2gzkshap8xj33qss7c5zutd9mrjvrgwohr2q7t1sv",
          label: "dex scanner"
        },
        {
          href: "https://x.com/lumpenspace",
          label: "shitposts"
        }

      ]} />
    </>
  );
};
export default Home;