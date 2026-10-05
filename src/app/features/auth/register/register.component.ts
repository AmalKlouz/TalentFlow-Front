import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models/register-request'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;

  loading = false;
  errorMessage = '';
  successMessage = '';

  // =========================================================
  // LISTE DES COMPÉTENCES
  // =========================================================

  skills: string[] = [

    // Langages
    'Java',
    'Python',
    'C',
    'C++',
    'C#',
    'JavaScript',
    'TypeScript',
    'PHP',
    'Kotlin',
    'Swift',
    'Go',
    'Ruby',

    // Frontend
    'HTML',
    'CSS',
    'SCSS',
    'Angular',
    'React',
    'Vue.js',
    'Next.js',
    'Bootstrap',
    'Tailwind CSS',
    'Angular Material',

    // Backend
    'Spring Boot',
    'Spring Security',
    'Spring Data JPA',
    'Hibernate',
    'Node.js',
    'Express.js',
    'NestJS',
    '.NET',
    'ASP.NET Core',
    'Symfony',
    'Laravel',
    'Django',
    'FastAPI',

    // API / Architecture
    'REST API',
    'GraphQL',
    'Microservices',
    'API Gateway',
    'OAuth2',
    'JWT',
    'WebSocket',

    // Bases de données
    'PostgreSQL',
    'MySQL',
    'Oracle',
    'SQL Server',
    'MongoDB',
    'Redis',
    'Firebase',

    // DevOps / Cloud
    'Git',
    'GitHub',
    'GitLab',
    'Docker',
    'Docker Compose',
    'Jenkins',
    'GitHub Actions',
    'GitLab CI/CD',
    'Kubernetes',
    'Nginx',
    'SonarQube',
    'AWS',
    'Microsoft Azure',
    'Google Cloud',

    // Outils / Messaging
    'Apache Kafka',
    'RabbitMQ',
    'Eureka',

    // Tests
    'JUnit',
    'Mockito',
    'Postman',
    'Cypress',
    'Selenium',

    // Mobile
    'Android',
    'Android Studio',
    'Flutter',
    'React Native',

    // Data / AI
    'Machine Learning',
    'Deep Learning',
    'Data Analysis',
    'Pandas',
    'NumPy',
    'TensorFlow',
    'PyTorch',

    // Outils
    'Maven',
    'Gradle',
    'IntelliJ IDEA',
    'Visual Studio Code',
    'Eclipse',
    'Jira',
    'Confluence',

    // Méthodologies
    'Agile',
    'Scrum',
    'Kanban',
    'UML'
  ];

  // Compétences sélectionnées
  selectedSkills: string[] = [];


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({

      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        Validators.required
      ]

    });
  }


  // =========================================================
  // SÉLECTION D'UNE COMPÉTENCE
  // =========================================================

  toggleSkill(skill: string): void {

    const index =
      this.selectedSkills.indexOf(skill);

    if (index === -1) {

      this.selectedSkills.push(skill);

    } else {

      this.selectedSkills.splice(index, 1);

    }

    this.selectedSkills = [
      ...this.selectedSkills
    ];
  }


  // =========================================================
  // VÉRIFIER SI UNE COMPÉTENCE EST SÉLECTIONNÉE
  // =========================================================

  isSkillSelected(skill: string): boolean {

    return this.selectedSkills.includes(skill);
  }


  // =========================================================
  // REGISTER
  // =========================================================

  onSubmit(): void {

    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;
    }

    if (this.selectedSkills.length === 0) {

      this.errorMessage =
        'Veuillez sélectionner au moins une compétence.';

      return;
    }

    const password =
      this.registerForm.get('password')?.value;

    const confirmPassword =
      this.registerForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {

      this.errorMessage =
        'Les mots de passe ne correspondent pas.';

      return;
    }

    const request: RegisterRequest = {

      firstName:
        this.registerForm.get('firstName')?.value,

      lastName:
        this.registerForm.get('lastName')?.value,

      email:
        this.registerForm.get('email')?.value,

      password:
        password,

      skills:
        this.selectedSkills
    };

    this.loading = true;

    this.authService
      .register(request)
      .subscribe({

        next: (response) => {

          this.loading = false;

          this.successMessage =
            'Votre compte a été créé avec succès !';

          console.log(
            'Inscription réussie :',
            response
          );

          setTimeout(() => {

            this.router.navigate(['/login']);

          }, 1500);
        },

        error: (error) => {

          this.loading = false;

          console.error(
            'Erreur inscription :',
            error
          );

          this.errorMessage =
            error?.error?.message
            || 'Une erreur est survenue lors de l’inscription.';
        }
      });
  }
}
