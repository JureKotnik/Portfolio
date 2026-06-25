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

// 2. PUBLIC ENDPOINT: Fetch a single project by ID
router.get('/:id', (req: Request, res: Response) => {
  const project = projects.find(p => p.id === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }
  res.status(200).json(project);
});

// 3. SECURED ENDPOINT: Add a new project
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

// 4. SECURED ENDPOINT: Update an existing project by ID
router.put('/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, technologies, imageUrl, liveUrl, githubUrl } = req.body;

  const projectIndex = projects.findIndex(p => p.id === id);
  if (projectIndex === -1) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }
  const existingProject = projects[projectIndex];
  const updatedProject: Project = {
    ...existingProject,
    title: title !== undefined ? title : existingProject.title,
    description: description !== undefined ? description : existingProject.description,
    technologies: technologies !== undefined ? technologies : existingProject.technologies,
    imageUrl: imageUrl !== undefined ? imageUrl : existingProject.imageUrl,
    liveUrl: liveUrl !== undefined ? liveUrl : existingProject.liveUrl,
    githubUrl: githubUrl !== undefined ? githubUrl : existingProject.githubUrl,
  };

  projects[projectIndex] = updatedProject;
  res.status(200).json({ message: 'Project updated successfully!', project: updatedProject });
});

// 5. SECURED ENDPOINT: Delete an existing project by ID
router.delete('/:id', requireAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id === id);

  if (projectIndex === -1) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }
  projects.splice(projectIndex, 1);
  res.status(200).json({ message: 'Project deleted successfully!' });
});

export default router;