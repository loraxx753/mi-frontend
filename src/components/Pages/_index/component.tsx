// import { useEffect } from 'react';
// import { gql, useQuery } from '@apollo/client'
import { PageComponentType } from '@/lib/types'
// import Content from './content/_index.mdx'
import { HeroSection } from '@/components/ThirdParty/UiBlocks';
import { Button } from "@/components/ThirdParty/ShadCn/Button";

import { IconSection } from '@/components/ThirdParty/UiBlocks/IconSection';
import { usePageBackground, pageBackgrounds } from '@/lib/hooks/usePageBackground';

// import { Caption } from '@/components/Comics/index';

// const GET_PEOPLE = gql`
//       query Example{
//           getCharacters {
//             mangaName
//             race
//             team
//             mentors
//             students
//             dateOfBirth
//             dateOfDeath
//         }
//       }  
// `;



export const Content = () => <>
{/* Hero */}
  <div className="container relative py-24 lg:py-32">

    {/* Title */}
    <div className="mt-5 max-w-2xl text-center mx-auto">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-6xl bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-500 bg-clip-text text-transparent leading-tight py-2">
        Shimmering Stars ✨
      </h1>
    </div>
    {/* End Title */}
    <div className="mt-5 max-w-3xl text-center mx-auto">
      <p className="text-xl text-muted-foreground">
      Explore the cosmos within you. Discover your <b>zodiac sign</b>, understand your traits, 
      and uncover the celestial influences that shape your personality and destiny.
      </p>
    </div>
    {/* Buttons */}
    <div className="mt-8 gap-3 flex flex-col sm:flex-row justify-center items-stretch sm:items-center px-4">
      <Button size={"lg"} asChild className="w-full sm:w-auto">
        <a href="/signs">Explore Signs</a>
      </Button>
      <Button size={"lg"} asChild className="w-full sm:w-auto">
        <a href="/houses">Explore Houses</a>
      </Button>
      <Button size={"lg"} variant={"outline"} asChild className="w-full sm:w-auto">
        <a href="/reading">Get Your Chart</a>
      </Button>
    </div>
    {/* End Buttons */}
  </div>
{/* End Hero */}
</>


// Define the TypeScript interfaces
  export const IndexPage: PageComponentType = () => {
    // Set the cosmic background for the index page
    usePageBackground(pageBackgrounds.cosmic);
    
    // const { loading, error, data } = useQuery(GET_PEOPLE);
  
    // useEffect(() => {
    //   if (loading) return;
    //   if (error) return;
    //   console.log(data)
    // }, [loading, error, data]);
  
    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error : {error.message}</p>;
    return (
      <>
      <div className='font-komika-text'>
        <HeroSection.SimpleCentered className='relative'>
          <div className="bg-white/90 backdrop-blur-md rounded-2xl mx-4 sm:mx-6 lg:mx-auto max-w-5xl border border-white/20 mt-8">
            <Content />
          </div>
        </HeroSection.SimpleCentered>
        <div className="bg-white/90 backdrop-blur-md rounded-2xl mx-4 sm:mx-6 lg:mx-auto max-w-5xl border border-white/20 mt-8">
          <IconSection.CircleIconsCenterAligned />
        </div>
      </div>
      </>
    );
  }

  IndexPage.path = "/"