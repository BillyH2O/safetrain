
import { cookies } from 'next/headers';
import ChatWrapper from '../components/ChatWrapper';
import { RagChat } from '../lib/rag-chat';
import { redis } from '../lib/redis';

type PageProps = {
  params: { url: string | string[] | undefined };
};


function reconstructUrl({ url }: { url: string[] }){
  const decodedComponents = url.map((component) => decodeURIComponent(component));
  return decodedComponents.join('/');
};

const Page = async ({ params }: PageProps) => {
    
    const sessionCookie = (await cookies()).get("sessionId")?.value
    const reconstructedUrl = reconstructUrl({ url: params.url as string[]});
    const isAlreadyIndexed = await redis.sismember("indexead-urls", reconstructedUrl)

    const sessionId = (reconstructUrl + "--" + sessionCookie).replace(/\//g, "") // car les chat dépendent des user ET de l'url Pr ne pas avoir de pb on rempalce les // par des chaines vides à l'aide d'un regex

    const initialMessages = await RagChat.history.getMessages({ amount: 10, sessionId})

    if(!isAlreadyIndexed) {
        await RagChat.context.add({
        type: 'html',
        source: reconstructedUrl,
        });
        
        await redis.sadd("indexead-urls", reconstructedUrl)
    }

  return <ChatWrapper sessionId={sessionId} initialMessages={initialMessages}/>
}

export default Page;
