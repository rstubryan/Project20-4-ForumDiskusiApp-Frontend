import { useEffect, useState, useRef } from "react";
import { getQuestions } from "../../api/questionApi.js";
import { getCommentsByPostId } from "../../api/commentApi.js";
import Sidebar from "../molecules/Sidebar/index.jsx";
import Card from "../molecules/Card/index.jsx";
import ContainerLayout from "./ContainerLayout.jsx";
import PagesLayout from "./PagesLayout.jsx";
import CardHeader from "../organisms/CardHeader/index.jsx";
import CardPost from "../organisms/CardPost/index.jsx";
import SkeletonPlaceholder from "../atoms/SkeletonPlaceholder/index.jsx";
import { Link } from "react-router-dom";
import { getVotes } from "../../api/voteApi.js";

export default function QuestionPagesLayout() {
  const [questions, setQuestions] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [votesData, setVotesData] = useState({});
  const fetchQuestionsAndCommentsRef = useRef(false);

  useEffect(() => {
    if (!fetchQuestionsAndCommentsRef.current) {
      async function fetchQuestionsAndComments() {
        try {
          const questions = await getQuestions();
          const comments = {};
          const votesData = {};
          for (let question of questions) {
            comments[question.uuid] = await getCommentsByPostId(question.uuid);
            let votes = await getVotes(question.uuid);
            let upVotes = votes.filter((vote) => vote.role === "VOTE");
            let downVotes = votes.filter((vote) => vote.role === "DOWNVOTE");

            votesData[question.uuid] = {
              votes: upVotes.length,
              downVotes: downVotes.length,
            };
          }
          setQuestions(questions);
          setComments(comments);
          setVotesData(votesData);
          setLoading(false);
          console.log("Votes data:", votesData);
        } catch (error) {
          console.error("Error fetching questions and comments:", error);
          setLoading(false);
        }
      }
      fetchQuestionsAndComments();
      fetchQuestionsAndCommentsRef.current = true;
    }
  }, []);

  return (
    <>
      <PagesLayout>
        <ContainerLayout>
          <div className="row">
            <aside className="col-12 col-lg-2 mb-3 mb-lg-0">
              <Card className="shadow-sm">
                <Sidebar />
              </Card>
            </aside>
            <div className="col-12 col-lg-10 mb-3">
              <CardHeader
                title={"Questions"}
                description={
                  "This is the list of questions that have been asked by the community. Feel free to answer any of them! If you have a question, feel free to ask! We are here to help!"
                }
                buttonTitle={"Ask a Question"}
                toastsMessage={"ask a question"}
              />
            </div>
            <div className="col-12 col-lg-10 ms-auto mb-4">
              {loading ? (
                <>
                  <CardPost
                    title={
                      <SkeletonPlaceholder
                        variant={"secondary"}
                        className={"col-12"}
                      />
                    }
                    description={
                      <>
                        <SkeletonPlaceholder
                          variant={"body-tertiary"}
                          className={"col-12"}
                        />
                        <SkeletonPlaceholder
                          variant={"secondary"}
                          className={"col-12"}
                        />
                        <SkeletonPlaceholder
                          variant={"body-tertiary"}
                          className={"col-12"}
                        />
                      </>
                    }
                    showImage={false}
                    showButtons={false}
                    votes={
                      <>
                        <SkeletonPlaceholder
                          variant={"secondary"}
                          className={"col-12 col-lg-4"}
                        />
                      </>
                    }
                    answers={
                      <>
                        <SkeletonPlaceholder
                          variant={"body-tertiary"}
                          className={"col-12 col-lg-4"}
                        />
                      </>
                    }
                    className={"placeholder-glow mb-3"}
                  />
                </>
              ) : questions.length > 0 ? (
                questions
                  .filter((question) => question.forum === null)
                  .map((question) => (
                    <CardPost
                      key={question.id}
                      topic={question.topic?.name}
                      title={
                        <Link
                          to={`/question/${question.uuid}`}
                          className="text-decoration-none"
                        >
                          {question.title}
                        </Link>
                      }
                      description={question.body}
                      createdAt={new Date(question.createdAt).toLocaleString()}
                      username={question.createdBy.username}
                      avatarSrc={question.createdBy.avatar}
                      avatarAlt={question.createdBy.username}
                      votes={question[questions[0]?.QuestionVotes?.length || 0]}
                      downvotes={votesData[question.uuid]?.downVotes || 0}
                      answers={comments[question.uuid].length || 0}
                      showImage={false}
                      showButtons={false}
                      className={"mb-3"}
                    />
                  ))
              ) : (
                <Card>
                  <Card.Title className="d-flex align-items-center justify-content-center fw-semibold">
                    No Questions available
                  </Card.Title>
                </Card>
              )}
            </div>
          </div>
        </ContainerLayout>
      </PagesLayout>
    </>
  );
}
