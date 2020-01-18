import React from "react";
import { ListGroup, ListGroupItem, Button } from "reactstrap";
import { Transition } from "react-spring/renderprops";

export default function FileList(props) {
  return (
    <ListGroup>
        {props.files.length > 0 
        ? (<span className="mt-3 font-weight-bold">Selected photos</span>)
      : null}
      <Transition
        items={props.files}
        keys={item => item.name}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {item => aniProps => (
          <ListGroupItem
            style={{
              ...aniProps,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            {item.name}
            <Button size="sm" id={item.name} onClick={props.removeItem} color="danger" className="float-right">
              &times;
            </Button>
          </ListGroupItem>
        )}
      </Transition>
    </ListGroup>
  );
}
