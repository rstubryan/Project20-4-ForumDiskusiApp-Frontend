import Card from "../../molecules/Card/index.jsx";
import SubheadingText from "../../atoms/SubheadingText/index.jsx";
import Button from "../../atoms/Button/index.jsx";
import IconPlaceholder from "../../atoms/IconPlaceholder/index.jsx";
import UserPostDate from "../../molecules/UserPostDate/index.jsx";
import UserPostSummary from "../../molecules/UserPostSummary/index.jsx";

export default function CardPost({
  votes,
  answers,
  views,
  title,
  description,
  username,
  imgSrc,
  imgAlt,
  createdAt,
  className,
  ...props
}) {
  return (
    <>
      <Card className={`shadow-sm p-3 ${className}`} {...props}>
        <div className="row">
          <div className="col-sm-12 col-lg-2 text-start text-lg-end d-flex d-lg-block gap-3 gap-lg-0 mb-3 mb-lg-0">
            <UserPostSummary votes={votes} answers={answers} views={views} />
          </div>
          <div className="col-12 col-lg-10">
            <Card.Title className="text-primary">
              <SubheadingText cssReset={true} className="fw-semibold">
                {title}
              </SubheadingText>
            </Card.Title>
            <Card.Description className="lh-base mb-3">
              {description}
            </Card.Description>
            <div className="d-flex justify-content-between row">
              <div className="d-flex gap-3 col-12 col-md-6 mb-3 mb-md-0">
                <Button variant={"primary"} className={"w-100 w-md-auto"}>
                  <IconPlaceholder variant={"arrow-up"} />
                  Upvote
                </Button>
                <Button variant={"primary"} className="w-100 w-md-auto">
                  <IconPlaceholder variant={"arrow-down"} />
                  Upvote
                </Button>
              </div>
              <div className="col-12 col-md-6">
                <UserPostDate
                  className={"d-md-flex justify-content-md-end"}
                  username={username}
                  imgSrc={imgSrc}
                  imgAlt={imgAlt}
                  createdAt={createdAt}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}