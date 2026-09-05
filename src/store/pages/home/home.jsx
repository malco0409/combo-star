import React from 'react'
import Herosection from './../../components/Herosection';
import FeaturesSection from './../../components/Featuressection';
import ProductsSection from './../../components/Productssection2';
import PlisseSection from './../../components/PlisseSection';
import MeasuringHelp from './../../components/Measuringhelp';

function Home() {
  return (
    <div>
      <Herosection />
      <PlisseSection />
      <FeaturesSection />
      <ProductsSection />
      <MeasuringHelp />
    </div>
  )
}

export default Home
