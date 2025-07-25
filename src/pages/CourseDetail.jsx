import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { localStorageService } from "../services/localStorageService";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { stripHtml } from "../lib/utils";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState(null);

  // Function to ensure course has all required fields
  const ensureCourseData = (course) => {
    return {
      id: course.id || "",
      title: course.title || "Untitled Course",
      description: course.description || "No description available",
      category: course.category || "General",
      level: course.level || "Pemula",
      duration: course.duration || "0 jam",
      price: course.price || "free",
      originalPrice: course.originalPrice || 0,
      discountPrice: course.discountPrice || null,
      instructor: {
        name: course.instructor?.name || "Unknown Instructor",
        avatar: course.instructor?.avatar || "/api/placeholder/50/50",
        rating: course.instructor?.rating || 4.5,
        students: course.instructor?.students || 0,
      },
      image:
        course.coverImage ||
        course.thumbnail ||
        course.image ||
        "/api/placeholder/800/400",
      thumbnail:
        course.coverImage ||
        course.thumbnail ||
        course.image ||
        "/api/placeholder/400/300",
      students: course.students || 0,
      rating: course.rating || 4.5,
      status: course.status || "PUBLISHED",
      modules: course.modules || [],
      quizzes: course.quizzes || [],
      teacherId: course.teacherId || null,
      createdAt: course.createdAt || new Date().toISOString(),
      updatedAt: course.updatedAt || new Date().toISOString(),
    };
  };

  // Check if user can manage the course
  const canManageCourse = () => {
    if (!user || !course) return false;
    return (
      user.role === "admin" ||
      (user.role === "teacher" && course.teacherId === user.id)
    );
  };

  // Fetch course data from localStorage
  useEffect(() => {
    const fetchCourse = () => {
      setIsLoading(true);
      try {
        const foundCourse = localStorageService.getCourseById(id);
        if (!foundCourse) {
          navigate("/not-found");
          return;
        }
        const processedCourse = ensureCourseData(foundCourse);
        setCourse(processedCourse);
        setEditedCourse(processedCourse);
        // Check if user is enrolled
        if (user) {
          const enrollments = localStorageService.getUserEnrollments(user.id);
          setIsEnrolled(enrollments.some((e) => e.courseId === id));
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        navigate("/not-found");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [id, user, navigate]);

  const handleEnroll = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      localStorageService.enrollCourse(user.id, course.id);
      setIsEnrolled(true);
      navigate(`/belajar/${course.id}`);
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  const handleSave = () => {
    try {
      localStorageService.updateCourse(editedCourse);
      setCourse(editedCourse);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <>
      <main className="container my-5">
        <div className="row">
          <div className="col-lg-8">
            {canManageCourse() && (
              <div className="mb-4">
                {isEditing ? (
                  <div className="d-flex gap-2">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex gap-2">
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Course
                    </Button>
                    <Button onClick={() => navigate(`/course/${id}/manage`)}>
                      Manage Course
                    </Button>
                  </div>
                )}
              </div>
            )}

            <h1 className="mb-4">{course.title}</h1>
            <div className="card mb-4">
              <img
                src={
                  course.coverImage ||
                  course.thumbnail ||
                  course.image ||
                  "/api/placeholder/800/400"
                }
                alt={course.title}
                className="card-img-top"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="card-body">
                <div className="mb-4">
                  <h5>About This Course</h5>
                  <div
                    className="course-description"
                    style={{
                      whiteSpace: "pre-line",
                      lineHeight: "1.7",
                      fontSize: "1rem",
                      color: "#333",
                    }}>
                    {stripHtml(course.description)}
                  </div>
                </div>

                <div className="mb-4">
                  <h5>Course Details</h5>
                  <ul className="list-unstyled">
                    <li>Level: {course.level}</li>
                    <li>Duration: {course.duration}</li>
                    <li>Category: {course.category}</li>
                    <li>Students Enrolled: {course.students}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Course Price</h5>
                <p className="card-text h3 mb-4">
                  {course.price === "free" ? "Free" : `Rp ${course.price}`}
                </p>

                {!isEnrolled ? (
                  <Button
                    onClick={handleEnroll}
                    className="w-100"
                    disabled={isLoading}>
                    Enroll Now
                  </Button>
                ) : (
                  <Button
                    onClick={() => navigate(`/belajar/${course.id}`)}
                    className="w-100">
                    {isEnrolled
                      ? "Sudah Diikuti - Lanjut Belajar"
                      : "Continue Learning"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CourseDetail;
