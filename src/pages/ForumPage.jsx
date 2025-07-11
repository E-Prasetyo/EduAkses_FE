import React, { useState } from "react";
import { Container, Card, Button, Pagination } from "react-bootstrap";

import AjukanPertanyaanModal from "../components/AjukanPertanyaanModal";
import ListForum from "../components/ListForum";
import "../styles/ForumPage.css";

const ForumPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Container className="my-5">
        <h1 className="text-center mb-4">Forum Diskusi</h1>

        {/* List pertanyaan dummy */}
        <ListForum />
      </Container>

      {/* Modal */}
    </>
  );
};

export default ForumPage;
