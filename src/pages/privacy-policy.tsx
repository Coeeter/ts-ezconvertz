import { S3 } from 'aws-sdk';
import { GetStaticProps } from 'next';

type PrivacyPolicyProps = {
  html: string;
};

export default function PrivacyPolicy({ html }: PrivacyPolicyProps) {
  return <div dangerouslySetInnerHTML={{ __html: html }} style={{
    color: 'white !important'
  }} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const s3 = new S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  });

  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  const downloadConfig = {
    Bucket: bucketName,
    Key: 'privacy-policy.html',
  };
  const { Body } = await s3.getObject(downloadConfig).promise();
  const html = Body?.toString('utf-8');
  return {
    props: {
      html,
    },
  };
};
