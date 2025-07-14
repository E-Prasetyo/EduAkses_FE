import React from "react";
import Header from "../components/Header";
import ListForum from "../components/ListForum";
import AjukanPertanyaanModal from "../components/AjukanPertanyaanModal";
import Footer from "../components/Footer";
import { Container } from "react-bootstrap";

const Diskusi = () => {
  return (
    <div className="flex flex-col items-end bg-white min-h-screen">
      <main className="flex pb-24 pt-12 flex-col items-center gap-12 w-full">
        <div className="w-full max-w-[1290px] px-4">
          <div className="text-center mb-12">
            <h1 className="text-black font-exo text-4xl lg:text-5xl font-semibold leading-tight capitalize mb-4 mt-4">
              Forum Diskusi
            </h1>
            <p className="text-edu-dark-gray font-jost text-lg font-normal leading-relaxed max-w-2xl mx-auto">
              Bergabunglah dengan komunitas belajar kami. Bertanya, berbagi
              pengalaman, dan belajar bersama dengan sesama pelajar
            </p>
          </div>

          <Container className="my-5">
            {/* List pertanyaan dummy */}
            <ListForum />
          </Container>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Diskusi;
