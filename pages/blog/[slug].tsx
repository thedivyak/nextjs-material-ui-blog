import React, { FC, ReactElement, useEffect } from 'react'
import { getPost, getSortedPostsData } from '../../src/lib/posts'
import { PostData } from '../../src/types/posts'
import { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import marked from 'marked'
import Head from 'next/head'
import Link from 'next/link'
import hljs from 'highlight.js'
import '../../node_modules/highlight.js/styles/monokai.css'
import '../../node_modules/highlight.js/lib/highlight'
import styles from '../../styles/Slug.module.css'
import { PageHeading } from '../../src/components/PageHeading'
import { Card, CardMedia, Typography } from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub'
import TopicsDisplay from '../../src/components/TopicsDisplay'
import PreviewCard from '../../src/components/PreviewCard'
import { Preview } from '../../src/components/Preview'

type Props = { postData: PostData; nextPath: PostData }

const Slug: FC<Props> = ({ postData, nextPath }): ReactElement => {
  marked.setOptions({
    highlight: function (code) {
      return hljs.highlightAuto(code).value
    },
  })

  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block: HTMLElement) => {
      hljs.highlightBlock(block)
    })
  }, [])

  return (
    <>
      <Head>
        <title>{postData.title}</title>
        <meta name="description" content={postData.description} />
      </Head>
      <div className={styles['text-content']}>
        <PageHeading title={postData.title} />
      </div>
      <div className={styles['image-container']}>
        <div className={styles.info}>
          <Typography variant="body1">
            {postData.date} — written by{' '}
            <a
              href="http://www.github.com/FelixMohr"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Felix <GitHubIcon fontSize="small" style={{ marginLeft: 10 }} />
            </a>
          </Typography>
          <TopicsDisplay topics={postData.topics} n={10} noMargin />
        </div>
      </div>
      <div className={styles['image-container']}>
        <Card className={styles.image}>
          <CardMedia>
            <img alt={postData.title} src={`/large/${postData.id}.png`} />
          </CardMedia>
        </Card>
      </div>
      <div className={styles['post-container']} dangerouslySetInnerHTML={{ __html: marked(postData.content) }} />
      <div className={styles['post-container']} style={{ paddingTop: 50 }}>
        <hr />
        <Typography variant="h4" component="p" style={{ paddingBottom: 20 }}>
          Recommended
        </Typography>
        <PreviewCard post={nextPath} noMargin />
      </div>
    </>
  )
}

type StaticPaths = { paths: { params: { slug: string } }[]; fallback: boolean }

export const getStaticProps = async ({
  params: { slug },
}: GetStaticPropsContext<{ slug: string }>): Promise<
  GetStaticPropsResult<{
    postData: PostData
    nextPath: PostData
  }>
> => {
  const postData = getPost(slug, true)

  const paths = getSortedPostsData()

  const nextPath = paths.reduce(
    (prev, curr, i) => (curr.id === slug && i >= 1 ? paths[i - 1] : curr),
    paths[paths.length - 1],
  )

  return {
    props: {
      postData,
      nextPath,
    },
  }
}

export const getStaticPaths = async (): Promise<StaticPaths> => {
  const paths = getSortedPostsData().map(({ id }) => ({
    params: {
      slug: id,
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export default Slug
