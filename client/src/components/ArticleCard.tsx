import { Link } from "wouter";
import { type Article, getCategoryPillClass, formatDate } from "@/lib/articles";

interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

export default function ArticleCard({ article, priority = false }: ArticleCardProps) {
  return (
    <article className="masonry-item group">
      <Link
        href={`/article/${article.slug}`}
        className="block rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-xl hover:shadow-[var(--twilight)]/10 transition-all duration-500 border border-border/50 hover:border-[var(--aurora)]/20"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={article.heroImage}
            alt={article.imageDescription || article.title}
            width={600}
            height={400}
            loading={priority ? "eager" : "lazy"}
            className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {/* Category pill */}
          <div className="absolute top-3 left-3">
            <span className={getCategoryPillClass(article.category)}>
              {article.categoryName}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-heading text-[1.05rem] font-700 text-card-foreground leading-snug line-clamp-2 group-hover:text-[var(--aurora-dim)] transition-colors duration-300 mb-2">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-3">
            {article.metaDescription}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground/70">
            <span>{formatDate(article.dateISO)}</span>
            <span>{article.readingTime}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
