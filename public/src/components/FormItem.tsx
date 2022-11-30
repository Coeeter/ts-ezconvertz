import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Spinner,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  Control,
  SubmitHandler,
  useForm,
  UseFormSetValue,
} from 'react-hook-form';
import { useService } from '../context/VideoServiceContext';
import { FormValues } from '../pages/Home';
import { YoutubeMetaData } from '../service/VideoService';

export default function FormItem({
  index,
  control,
  setValue,
}: {
  index: number;
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}) {
  const { colorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(false);
  const [videoMetaData, setVideoMetaData] = useState<YoutubeMetaData>();
  const service = useService();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<{ url: string }>();

  const onSubmit: SubmitHandler<{ url: string }> = async ({ url }) => {
    setIsLoading(true);
    let videoId;
    try {
      videoId = new URL(url).searchParams.get('v');
    } catch {
      setIsLoading(false);
      return setError('url', { message: 'Invalid youtube url given' });
    }
    if (!videoId) {
      setIsLoading(false);
      return setError('url', { message: 'Invalid youtube url given' });
    }
    const data = await service?.getDataFromLink(videoId);
    if (!data) return;
    setVideoMetaData(data);
    setIsLoading(false);
  };

  const isMetaDataRetrieved =
    videoMetaData?.name || videoMetaData?.thumbnail || videoMetaData?.length;

  useEffect(() => {
    setValue(`videos.${index}.start`, '00:00:00', { shouldValidate: true });
    if (videoMetaData?.videoId)
      setValue(`videos.${index}.videoId`, videoMetaData?.videoId!, {
        shouldValidate: true,
      });
    if (videoMetaData?.name)
      setValue(`videos.${index}.name`, videoMetaData?.name, {
        shouldValidate: true,
      });
    if (videoMetaData?.length)
      setValue(
        `videos.${index}.end`,
        service?.transformSecondsToTimeString(videoMetaData.length!)!,
        {
          shouldValidate: true,
        }
      );
  }, [videoMetaData]);

  return (
    <VStack
      w="100%"
      position="relative"
      border="2px"
      borderColor={colorMode == 'dark' ? 'red.300' : 'red.500'}
      borderRadius="lg"
      bg={colorMode == 'dark' ? 'red.900' : 'red.200'}
      p={5}
      gap={1}
    >
      {isMetaDataRetrieved ? (
        <VStack>
          <Heading alignSelf={'start'} size="md">
            Youtube video to convert:
          </Heading>
          <Image src={videoMetaData.thumbnail} alignSelf="start" />
          <Text fontWeight="semibold" alignSelf="start">
            {videoMetaData.name} (
            {service?.transformSecondsToTimeString(videoMetaData.length!)})
          </Text>
        </VStack>
      ) : null}
      <FormControl isInvalid={errors.url != null}>
        <FormLabel>Youtube Url</FormLabel>
        <InputGroup>
          <Input
            borderWidth={2}
            type="url"
            placeholder="Paste url of youtube video to convert"
            {...register('url', {
              required: 'Url of youtube video required!',
            })}
          />
          <InputRightAddon p={0} overflow="hidden">
            <Button
              onClick={handleSubmit(onSubmit)}
              borderRadius={0}
              w="100%"
              isDisabled={isLoading}
            >
              {isLoading ? (
                <Spinner />
              ) : isMetaDataRetrieved ? (
                'Update'
              ) : (
                'Next'
              )}
            </Button>
          </InputRightAddon>
        </InputGroup>
        <FormErrorMessage>{errors.url?.message}</FormErrorMessage>
      </FormControl>
      {isMetaDataRetrieved ? (
        <VStack w="100%">
          <FormControl
            isInvalid={
              control.getFieldState(`videos.${index}.name`).error != null
            }
          >
            <FormLabel>Name of file when downloaded</FormLabel>
            <Input
              noOfLines={4}
              placeholder="Name of file when downloaded"
              {...control.register(`videos.${index}.name`, {
                required: 'Name is required',
              })}
            />
            <FormErrorMessage>
              {control.getFieldState(`videos.${index}.name`).error?.message}
            </FormErrorMessage>
          </FormControl>
          <HStack w="100%">
            <FormControl
              isInvalid={
                control.getFieldState(`videos.${index}.start`).error != null
              }
            >
              <FormLabel>Start</FormLabel>
              <Input
                placeholder="Point of video to start conversion"
                {...control.register(`videos.${index}.start`, {
                  required: 'Start time is required',
                  pattern: {
                    value:
                      /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/g,
                    message: 'Invalid time provided',
                  },
                })}
              />
              <FormErrorMessage>
                {control.getFieldState(`videos.${index}.start`).error?.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                control.getFieldState(`videos.${index}.end`).error != null
              }
            >
              <FormLabel>End</FormLabel>
              <Input
                placeholder="Point of video to stop conversion"
                {...control.register(`videos.${index}.end`, {
                  required: 'End time is required',
                  pattern: {
                    value:
                      /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/g,
                    message: 'Invalid time given',
                  },
                })}
              />
              <FormErrorMessage>
                {control.getFieldState(`videos.${index}.end`).error?.message}
              </FormErrorMessage>
            </FormControl>
          </HStack>
          <Input
            display="none"
            {...control.register(`videos.${index}.videoId`, {
              required: true,
            })}
          />
        </VStack>
      ) : null}
    </VStack>
  );
}
