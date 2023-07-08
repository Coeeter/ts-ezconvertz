import { S3 } from 'aws-sdk';
import { GetStaticProps } from 'next';

type TermsOfUseProps = {
  html: string;
};

export default function TermsOfUse({ html }: TermsOfUseProps) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const s3 = new S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  });

  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  const downloadConfig = {
    Bucket: bucketName,
    Key: 'terms-of-use.html',
  };
  const { Body } = await s3.getObject(downloadConfig).promise();
  const html = Body?.toString('utf-8');
  return {
    props: {
      html,
    },
  };
};
