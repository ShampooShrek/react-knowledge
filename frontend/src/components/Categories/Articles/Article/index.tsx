import Articles from "@/models/articles";
import Link from "next/link";

interface ArticleContainerProps {
  article: Articles;
}

export default function Container({ article }: ArticleContainerProps) {
  return (
    <Link
      href={`/articles/${article.id}`}
      className="flex flex-row flex-nowrap mb-3 h-40 bg-mantle rounded p-4 cursor-pointer"
    >
      <div className="flex w-40 mr-4">
        <img
          src={article.imageUrl ?? "/aaa.png"}
          className="rounded-lg w-full h-full"
          alt={`${article.name}-image`}
        />
      </div>
      <div className="flex flex-col h-full w-full justify-between items-start">
        <div className="overflow-ellipsis max-w-full overflow-hidden  ">
          <span className="text-2xl font-bold mb-1 cursor-pointer">
            {article.name}
          </span>
          <br />
          <span className="text-[#bbb] max-w-full text-ellipsis ">
            {article.description}
          </span>
        </div>
        <span>
          <b>Author:</b> {article.user!.name}
        </span>
      </div>
    </Link>
  );
}
