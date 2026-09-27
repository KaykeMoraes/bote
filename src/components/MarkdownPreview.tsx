import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const markdownStyles = [
  'text-[15px] leading-[1.8] text-neutral-700 [overflow-wrap:anywhere] dark:text-neutral-300',
  '[&_h1]:my-[1.6em] [&_h1]:mb-[0.65em] [&_h1]:text-[2em] [&_h1]:font-semibold [&_h1]:leading-[1.3] [&_h1]:tracking-[-0.025em] [&_h1]:text-neutral-900 dark:[&_h1]:text-neutral-100',
  '[&_h2]:my-[1.6em] [&_h2]:mb-[0.65em] [&_h2]:border-b [&_h2]:border-neutral-200 [&_h2]:pb-[0.35em] [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-[1.3] [&_h2]:tracking-[-0.025em] dark:[&_h2]:border-neutral-800 dark:[&_h2]:text-neutral-100',
  '[&_h3]:my-[1.6em] [&_h3]:mb-[0.65em] [&_h3]:text-[1.2rem] [&_h3]:font-semibold [&_h3]:leading-[1.3] [&_h3]:tracking-[-0.025em] [&_h3]:text-neutral-900 dark:[&_h3]:text-neutral-100',
  '[&_h4]:my-[1.6em] [&_h4]:mb-[0.65em] [&_h4]:font-semibold [&_h4]:leading-[1.3] [&_h4]:tracking-[-0.025em] [&_h4]:text-neutral-900 dark:[&_h4]:text-neutral-100',
  '[&>h1:first-child]:mt-0 [&>h1:first-child]:mb-6 [&>h1:first-child]:text-[2rem]',
  '[&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-[1.6em] [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-[1.6em] [&_li]:pl-1',
  '[&_a]:text-neutral-900 [&_a]:underline [&_a]:underline-offset-[3px] dark:[&_a]:text-neutral-100',
  '[&_blockquote]:my-4 [&_blockquote]:border-l-[3px] [&_blockquote]:border-neutral-300 [&_blockquote]:py-0 [&_blockquote]:pl-4 [&_blockquote]:text-neutral-500 dark:[&_blockquote]:border-neutral-700 dark:[&_blockquote]:text-neutral-400',
  '[&_:not(pre)>code]:rounded-[0.35rem] [&_:not(pre)>code]:border [&_:not(pre)>code]:border-neutral-200 [&_:not(pre)>code]:bg-neutral-100 [&_:not(pre)>code]:px-[0.35em] [&_:not(pre)>code]:py-[0.1em] [&_:not(pre)>code]:text-[0.9em] dark:[&_:not(pre)>code]:border-neutral-700 dark:[&_:not(pre)>code]:bg-neutral-900',
  '[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-neutral-200 [&_pre]:bg-neutral-50 [&_pre]:p-4 [&_pre]:px-5 dark:[&_pre]:border-neutral-800 dark:[&_pre]:bg-neutral-950 [&_pre_code]:text-[0.9em]',
  '[&_hr]:my-8 [&_hr]:border-neutral-200 dark:[&_hr]:border-neutral-800',
  '[&_table]:my-4 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:border-collapse [&_th]:border [&_th]:border-neutral-200 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border [&_td]:border-neutral-200 [&_td]:px-3 [&_td]:py-2 [&_td]:text-left dark:[&_th]:border-neutral-700 dark:[&_td]:border-neutral-700',
].join(' ')

type MarkdownPreviewProps = {
  title: string
  content: string
  className?: string
}

export const MarkdownPreview = ({
  title,
  content,
  className = '',
}: MarkdownPreviewProps) => (
  <article className={`${markdownStyles} ${className}`}>
    <h1>{title || 'Sem título'}</h1>
    {content ? (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    ) : (
      <p className="text-neutral-400">
        A visualização do Markdown aparecerá aqui.
      </p>
    )}
  </article>
)
