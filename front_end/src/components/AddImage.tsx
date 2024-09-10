import React, { useState, ChangeEvent, FormEvent } from "react";
import { Modal } from "react-bootstrap";
import { uploadVacationImage } from "../api/vactions-api";

type propsType = {
  pid: number;
  setShowModal: any;
  showModal: boolean;
};

export const AddImage = (props: propsType) => {  
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (image) {
        await uploadVacationImage(props.pid, image);
        alert("image added");
        props.setShowModal(false);
    } else {
      alert("You must enter product-id & select an image");
    }
  };

  return (
    <Modal
      show={props.showModal}
      onHide={() => {
        props.setShowModal(false);
      }}
    >
      <div style={{ padding: "4%" }}>
        <form onSubmit={handleSubmit}>
          <p> product-id: {props.pid} </p>
          <input
            type="file"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) setImage(e.target.files[0]);
            }}
            required
          />
          <br />
          <br />
          <button type="submit">Upload Image</button>
        </form>
      </div>
    </Modal>
  );
};