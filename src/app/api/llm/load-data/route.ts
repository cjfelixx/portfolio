import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import path from 'path';

export async function GET(request: Request) {

  const loader = new PDFLoader(path.resolve("public/ClydeFelix_resume.pdf"));
  const docs = await loader.load();
    return Response.json(docs, {
      status: 200,
    })
  }