import { useAddReactionMutation } from "./postsSliceRTKQ";

const reactionEmoji = {
  thumbsUp: "👍",
  wow: "😮",
  heart: "❤️",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionButtons = ({ post }) => {
  const [addReaction] = useAddReactionMutation();

  const onClick = (name) => {
    const newValue = post.reactions[name] + 1;
    addReaction({
      postId: post.id,
      reactions: { ...post.reactions, [name]: newValue },
    });
  };

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={() => onClick(name)}
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};
export default ReactionButtons;
