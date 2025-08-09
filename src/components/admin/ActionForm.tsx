import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

// Définition du type Action
interface Action {
  id?: number;
  title: string;
  content: string;
  link?: string;
  status: 'draft' | 'published' | 'archived';
  image_path?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
}

// Schéma de validation avec Zod
const actionFormSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  content: z.string().min(1, 'Le contenu est requis'),
  link: z.string().url('URL invalide').or(z.literal('')).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  image: z.any().optional()
});

type ActionFormValues = z.infer<typeof actionFormSchema> & {
  image?: FileList;
};

interface ActionFormProps {
  action?: Action;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ActionForm: React.FC<ActionFormProps> = ({ action, onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { getAuthHeader } = useAuth();

  const isEditing = !!action?.id;
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ActionFormValues>({
    resolver: zodResolver(actionFormSchema),
    defaultValues: {
      title: action?.title || '',
      content: action?.content || '',
      link: action?.link || '',
      status: action?.status || 'draft',
      image: undefined,
    },
  });
  
  // Log des erreurs de validation
  console.log('Erreurs de validation:', errors);
  console.log('Erreur image:', errors.image);
  
  // Gestion de la prévisualisation de l'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleImageChange appelé avec:', e.target.files);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log('Fichier sélectionné:', file.name, file.type, file.size);
      
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La taille du fichier ne doit pas dépasser 5MB');
        return;
      }
      
      // Vérifier le type de fichier
      if (!file.type.match('image.*')) {
        toast.error('Veuillez sélectionner un fichier image valide');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Prévisualisation de l\'image chargée');
        setPreviewImage(reader.result as string);
      };
      reader.onerror = () => {
        console.error('Erreur lors de la lecture du fichier');
        toast.error('Erreur lors de la lecture du fichier');
      };
      reader.readAsDataURL(file);
      
      // Mettre à jour la valeur du champ pour react-hook-form
      // Utiliser un objet FileList simulé pour stocker le fichier
      const fileList = {
        0: file,
        length: 1,
        item: (index: number) => (index === 0 ? file : null),
        [Symbol.iterator]: function* () {
          yield file;
        }
      } as unknown as FileList;
      
      setValue('image', fileList);
    } else {
      console.log('Aucun fichier sélectionné');
      setPreviewImage(null);
      setValue('image', undefined as any);
    }
  };

  const onSubmit = async (data: ActionFormValues) => {
    console.log('🎯 FONCTION onSubmit APPELÉE !');
    console.log('=== DÉBUT SOUMISSION FORMULAIRE ===');
    console.log('Données du formulaire:', data);
    setIsSubmitting(true);
    
    try {
      // Créer un FormData pour envoyer les fichiers et les données du formulaire
      const formData = new FormData();
      
      // Ajouter les champs du formulaire
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('status', data.status);
      if (data.link) {
        formData.append('link', data.link);
      }
      
      // Ajouter le fichier s'il existe
      if (data.image && data.image.length > 0) {
        console.log('Ajout du fichier:', data.image[0].name);
        formData.append('files', data.image[0]); // Utiliser 'files' comme dans LancerAlerte
      }

      // URL de l'API backend
      const apiUrl = ''; // Laissez vide pour utiliser le même domaine
      const url = `${apiUrl}${isEditing ? `/api/actions/${action.id}` : '/api/actions'}`;
      const method = isEditing ? 'PUT' : 'POST';
      
      // Debug: Afficher le contenu du FormData
      console.log('Contenu du FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      console.log('Envoi de la requête à:', url);
      console.log('Méthode:', method);
      console.log('Données du formulaire:', Object.fromEntries(formData.entries()));
      
      const response = await fetch(url, {
        method,
        body: formData,
        // Ne pas définir le header Content-Type, il sera défini automatiquement avec la boundary
        credentials: 'include',
        mode: 'cors',
      });

      console.log('Réponse reçue:', {
        status: response.status,
        statusText: response.statusText
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Réponse texte brute:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { error: errorText };
        }
        
        console.log('Erreur détaillée du serveur:', errorData);
        throw new Error(errorData.error || 'Erreur lors de la requête');
      }

      const responseData = await response.json();
      console.log('Réponse de succès:', responseData);
      toast.success(`Action ${isEditing ? 'mise à jour' : 'créée'} avec succès`);
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      console.log('Message d\'erreur:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Charger l'image de prévisualisation si on est en mode édition
  useEffect(() => {
    if (action?.image_path) {
      setPreviewImage(action.image_path);
    }
  }, [action]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Modifier une action' : 'Nouvelle action'}
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" /> Annuler
        </Button>
      </div>

      <form 
        onSubmit={(e) => {
          console.log('🎯 FORMULAIRE onSubmit DÉCLENCHÉ !');
          console.log('Event:', e);
          handleSubmit(onSubmit)(e);
        }} 
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Colonne de gauche - Formulaire */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Titre de l'action"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="content">Contenu *</Label>
              <Textarea
                id="content"
                {...register('content')}
                placeholder="Décrivez l'action en détail..."
                rows={8}
                className={errors.content ? 'border-red-500' : ''}
              />
              {errors.content && (
                <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="link">Lien (optionnel)</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://exemple.com"
                {...register('link')}
                className={errors.link ? 'border-red-500' : ''}
              />
              {errors.link && (
                <p className="text-sm text-red-500 mt-1">{errors.link.message}</p>
              )}
            </div>
          </div>

          {/* Colonne de droite - Image et statut */}
          <div className="space-y-6">
            <div>
              <Label>Image</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="mx-auto h-40 w-auto object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute -top-2 -right-2"
                        onClick={() => setPreviewImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Téléverser une image</span>
                      <input
                        id="image-upload"
                        name="image"
                        type="file"
                        className="sr-only"
                        accept="image/png, image/jpeg, image/gif, image/webp"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF jusqu'à 10MB
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                {...register('status')}
                className="w-full p-2 border rounded-md mt-1"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            onClick={() => {
              console.log('🎯 BOUTON CLICKÉ !');
              console.log('isSubmitting:', isSubmitting);
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? 'Mettre à jour' : 'Créer'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ActionForm;
