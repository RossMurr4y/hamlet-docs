import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import HamletComponents from '@site/src/components/HamletComponents';

const HamletReferenceDataSchema = () => {
  return (
    <Layout id="HamletReferenceData">
      <div className="container">
        <div className="row">
          <div className="col col--1" />
          <div className="col col--10 component">
            <HamletComponents type="reference" version="latest" />
          </div>
          <div className="col col--1" />
        </div>
      </div>
    </Layout>
  );
};

export default HamletReferenceDataSchema;
