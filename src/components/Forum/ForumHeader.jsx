import React from "react";

const ForumHeader = ({ items }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-black font-exo text-4xl lg:text-5xl font-semibold leading-tight capitalize mb-4 mt-4">
        Forum Diskusi EduAkses
      </h1>
      <p className="text-edu-dark-gray font-jost text-lg font-normal leading-relaxed max-w-2xl mx-auto">
        Bergabunglah dengan komunitas belajar kami. Bertanya, berbagi
        pengalaman, dan belajar bersama dengan sesama pelajar dan pengajar.
      </p>

      {/* Forum Statistics */}
      {items.length > 0 && (
        <div className="row mt-4 justify-content-center">
          <div className="col-auto">
            <div className="d-flex gap-4 text-center">
              <div>
                <div className="h5 text-primary mb-0">{items.length}</div>
                <small className="text-muted">Topik</small>
              </div>
              <div>
                <div className="h5 text-success mb-0">
                  {items.reduce(
                    (sum, item) => sum + (item.jumlahBalasan || 0),
                    0
                  )}
                </div>
                <small className="text-muted">Balasan</small>
              </div>
              <div>
                <div className="h5 text-info mb-0">
                  {items.reduce((sum, item) => sum + (item.views || 0), 0)}
                </div>
                <small className="text-muted">Views</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumHeader;
