import React from "react";
import Alert from "react-bootstrap/Alert";

export default function Error({ error }) {
  if (error.show) {
    return (
      <Alert variant="danger">
        {/*<Alert.Heading>Oh snap! You got an error!</Alert.Heading>*/}
        {error.message}
      </Alert>
    );
  }

  return null;
}
