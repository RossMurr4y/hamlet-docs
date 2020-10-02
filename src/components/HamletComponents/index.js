import React, { useState, useEffect } from "react";
import Admonition from "react-admonitions";
import YAML from "json2yaml";

import "./styles.css";
import {
  getAsyncSchemaData,
  getAttributeStructure,
  getComponentStructure,
} from "@site/src/components/HamletJsonSchema";
import HamletExample from "@site/src/components/HamletExample";
import { getComponentExampleCodeblock } from "../HamletJsonSchema";

function HamletAttribute(props) {
  return (
    <tr className="ref-row-data">
      <td>{props.name}</td>
      <td>{props.mandatory && "Yes"}</td>
      {props.type === "object" ? (
        <td>
          <a href={"#" + props.name}>{props.name} Object</a>
        </td>
      ) : (
        <td className="capitalize">{Array(props.type).toLocaleString()}</td>
      )}
      <td>
        {props.enum && (
          <p>
            {String(props.enum)
              .split(",")
              .map((str) => '"' + str + '", ')}
          </p>
        )}
      </td>
      <td>
        {props.default &&
          String(props.default)
            .split(",")
            .map((str) => '"' + str + '"')}
      </td>
      <td>{props.description && props.description}</td>
    </tr>
  );
}

function HamletSchema(props) {
  const [schema, setSchema] = useState({ attributes: [] });

  useEffect(() => {
    setSchema(getAttributeStructure(props.attributes));
  }, []);

  return (
    <React.Fragment>
      <table className="reference">
        <colgroup className="ref-col-group">
          <col className="ref-col--attr" />
          <col className="ref-col--mand" />
          <col className="ref-col--type" />
          <col className="ref-col--vals" />
          <col className="ref-col--def" />
          <col className="ref-col--desc" />
        </colgroup>
        <thead className="ref-title">
          <div className="schema-title">
            <a id={props.name}>{props.name + " Schema"}</a>
          </div>
        </thead>
        <thead className="reference-thead">
          <tr className="ref-row-headers">
            <th>Attributes</th>
            <th>Mandatory</th>
            <th>Type</th>
            <th>Valid Values</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody className="reference-tbody">
          {schema.attributes.map((parent) => {
            return (
              <HamletAttribute
                name={parent.attribute.name}
                type={parent.attribute.type}
                mandatory={parent.attribute.mandatory}
                enum={parent.attribute.enum}
                default={parent.attribute.default}
                description={parent.attribute.description}
              />
            );
          })}
        </tbody>
      </table>
      {schema.attributes.map((parent) => {
        parent.children.map((child) => {
          return <HamletSchema name={child.name} attributes={child.value} />;
        });
      })}
    </React.Fragment>
  );
}

function HamletComponent(props) {
  const [componentSchemas, setComponentSchemas] = useState({
    schemas: [],
  });

  const structure = getComponentStructure(props);
  
  let example = structure.schemas.map((schema) => {
      return getComponentExampleCodeblock(schema)
    }
  );
  let exampleJSON = {label: "JSON", type: "json", value: JSON.stringify(example[0], null, 4)};
  let exampleYAML = {label: "YAML", type: "yaml", value: YAML.stringify(example[0], null, 2)};

  useEffect(() => {
    setComponentSchemas(structure);
  }, []);

  let labels = [];
  Object.entries(Object.values([exampleJSON, exampleYAML])).map((example) => {
    let [idx, ex] = example;
    let index = labels.findIndex((i) => i.label == ex.label);
    if (index === -1) {
      labels.push({ label: ex.label, value: ex.type });
    }
    return labels;
  });

  return (
    <div className="item shadow--tl component">
      <div className="container">
        <div className="row">
          <div className="col col--4 ref-component-header avatar">
            {props.name + " Component"}
          </div>
          <div className="col col--8">
            <HamletExample codeblocks={[exampleJSON, exampleYAML]} labels={labels} />
          </div>
        </div>
      </div>
      {componentSchemas.schemas.map((schema) => {
        return <HamletSchema name={schema.name} attributes={schema.value} />;
      })}
    </div>
  );
}

const HamletComponents = props => {
  const [definitions, setDefinitions] = useState({ components: [] });

  useEffect(() => {
    getAsyncSchemaData({ type: props.type, version: props.version }).then((result) => {
      setDefinitions(result);
    });
  }, []);

  return (
    <React.Fragment>
      <Admonition type="note" title="Under Development">
        The hamlet reference data is currently under development. Check back
        very soon to see a complete hamlet component reference.
      </Admonition>
      {definitions.components.map((component, index) => {
        return (
          <HamletComponent
            key={index}
            name={component.name}
            attributes={component.attributes}
          />
        );
      })}
    </React.Fragment>
  );
};

export default HamletComponents;