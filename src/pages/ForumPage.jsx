import React from "react";
import { Container, Card, Button, Pagination } from "react-bootstrap";
import Footer from "../components/Footer";
import "../styles/ForumPage.css";

const ForumPage = () => {
  const questions = [
    {
      id: 1,
      title: "Bagaimana Cara Install Ulang Windows",
      author: "John Doe",
      date: "3 hari yang lalu",
      replies: 5,
    },
    {
      id: 2,
      title: "Bagaimana Cara Install Ulang Windows",
      author: "Ali Zain",
      date: "2 hari yang lalu",
      replies: 3,
    },
    {
      id: 3,
      title: "Bagaimana Cara Install Ulang Windows",
      author: "Sarah",
      date: "5 jam yang lalu",
      replies: 2,
    },
    {
      id: 4,
      title: "Bagaimana Cara Install Ulang Windows",
      author: "Lina",
      date: "1 jam yang lalu",
      replies: 1,
    },
  ];

  return (
    <div>
      {/* Full-width header */}
      <div
        className="bg-dark text-white py-4 text-center"
        style={{ width: "100%" }}>
        <h2>Forum Diskusi</h2>
      </div>

      {/* Tengah seluruh konten */}
      <Container className="my-5 pb-5">
        <div
          className="bg-light py-5 px-4 rounded"
          style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h5 className="mb-4">Daftar Pertanyaan</h5>

          {questions.map((question) => (
            <Card key={question.id} className="mb-3 shadow-sm">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title className="mb-1">{question.title}</Card.Title>
                  <Card.Text
                    className="text-muted mb-0"
                    style={{ fontSize: "0.9rem" }}>
                    {question.author} • {question.date}
                  </Card.Text>
                </div>
                <small className="text-end text-muted">
                  {question.replies} balasan
                </small>
              </Card.Body>
            </Card>
          ))}
        </div>
        {/* Pagination */}
        <div className="d-flex justify-content-center my-4">
          <Pagination>
            <Pagination.Prev />
            <Pagination.Item active>1</Pagination.Item>
            <Pagination.Item>2</Pagination.Item>
            <Pagination.Item>3</Pagination.Item>
            <Pagination.Next />
          </Pagination>
        </div>

        {/* Button Ajukan */}
        <div className="text-center mt-3 mb-100">
          <Button size="md" className="ask-button">
            Ajukan Pertanyaan
          </Button>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default ForumPage;
