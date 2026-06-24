import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/authMiddleware';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
}

const router = Router();

let projects: Project[] = [
  {
    id: '1',
    title: 'Developer Portfolio',
    description: 'A secure full-stack portfolio workspace to display my professional programming skills.',
    technologies: ['React', 'Node.js', 'TypeScript', 'Express'],
    imageUrl: 'https://img.magnific.com/free-vector/glitch-error-404-page_23-2148105404.jpg?semt=ais_hybrid&w=740&q=80',
    githubUrl: 'https://github.com/JureKotnik'
  }
];

// 1. PUBLIC ENDPOINT: Fetch all projects for the frontend gallery
router.get('/', (req: Request, res: Response) => {
  res.status(200).json(projects);
});

// 2. TEMPORARY ENDPOINT: Add a new project
router.post('/', requireAuth, (req: Request, res: Response) => {
  const { title, description, technologies, imageUrl, liveUrl, githubUrl } = req.body;
  if (!title || !description || !technologies) {
     res.status(400).json({ error: 'Title, description, and technologies are required.' });
     return;
  }

  const newProject: Project = {
    id: Date.now().toString(),
    title,
    description,
    technologies,
    imageUrl: imageUrl || 'https://img.magnific.com/free-vector/glitch-error-404-page_23-2148105404.jpg?semt=ais_hybrid&w=740&q=80',
    liveUrl,
    githubUrl
  };

  projects.push(newProject);
  res.status(201).json({ message: 'Project added successfully!', project: newProject });
});

export default router;