import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectAllUsers } from "../users/usersSliceEA";

const PostAuthor = ({ userId }) => {
  const users = useSelector(selectAllUsers);

  const author = users.find((user) => user.id === userId);

  return (
    <span>
      by
      {author ? (
        <Link to={`/user/${userId}`}>{author.name}</Link>
      ) : (
        "Un known author"
      )}
    </span>
  );
};
export default PostAuthor;
