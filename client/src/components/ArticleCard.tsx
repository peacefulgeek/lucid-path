import { Link } from "wouter";
import { type Article, getCategoryPillClass } from "@/lib/articles";

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

export default function ArticleCard({ article, priority = false }: ArticleCardProps) {
  return (
    <article className="masonry-item group">
      <Link href={`/article/${article.slug}`} className="block rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="relative overflow-hidden">
          <img
            src={article.heroImage}
            alt={article.imageDescription || article.title}
            width={1200}
            height={675}
            loading={priority ? "eager" : "lazy"}
            className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <span className={getCategoryPillClass(article.category)}>
              {article.categoryName}
            </span>
            <h3 className="font-heading text-base font-700 text-white mt-2 leading-snug line-clamp-2">
              {article.title}
            </h3>
          </div>
        </div>
      </Link>
    </article>
  );
}
