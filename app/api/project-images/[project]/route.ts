import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const imageExtensions = new Set([
  '.avif',
  '.bmp',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.png',
  '.svg',
  '.webp',
]);

export async function GET(_request: Request, { params }: { params: Promise<{ project: string }> }) {
  const { project } = await params;
  const projectDirectory = path.join(process.cwd(), 'public', 'projects', project);

  try {
    const files = (await readdir(projectDirectory))
      .filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    const images = files.map((file) => `/projects/${project}/${encodeURIComponent(file)}`);
    const pages = Array.from({ length: Math.ceil(images.length / 3) }, (_, index) => ({
      label: `${String(index + 1).padStart(2, '0')} / Screenshots`,
      images: images.slice(index * 3, index * 3 + 3),
    }));

    return NextResponse.json(pages);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return NextResponse.json([]);
    }

    console.error(`Unable to read project images for "${project}".`, error);
    return NextResponse.json([], { status: 500 });
  }
}
