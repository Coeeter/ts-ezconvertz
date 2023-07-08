import Head from 'next/head';

type SeoHeadProps = {
  title: string;
  description: string;
};

export default function SeoHead({ title, description }: SeoHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/ezconvertz-logo.svg" />
    </Head>
  );
}
