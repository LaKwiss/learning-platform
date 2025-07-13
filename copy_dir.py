import os
import shutil

def copie_projet_filtree():
    """
    Copie le contenu du répertoire courant vers un dossier 'temp' sur le bureau,
    en excluant une liste de dossiers spécifiés.
    """
    # --- CONFIGURATION ---
    # Le script part du principe que le dossier source est celui où il est exécuté.
    source_repertoire = os.getcwd()

    # Crée un chemin vers le bureau de l'utilisateur, compatible Windows, macOS et Linux.
    destination_repertoire = os.path.join(os.path.expanduser('~'), 'Desktop', 'temp')

    # Liste des dossiers et fichiers à ignorer.
    # On utilise un "set" pour une recherche plus rapide.
    elements_a_ignorer = {'.git', 'node_modules', '.next', '.env'}
    
    # Ajoutons le nom du script lui-même pour qu'il ne se copie pas.
    elements_a_ignorer.add(os.path.basename(__file__))
    # --- FIN CONFIGURATION ---

    print(f"🚚 Démarrage de la copie...")
    print(f"Source : {source_repertoire}")
    print(f"Destination : {destination_repertoire}")
    print("-" * 30)

    try:
        # Crée le dossier de destination s'il n'existe pas.
        # S'il existe, on le supprime pour repartir de zéro.
        if os.path.exists(destination_repertoire):
            shutil.rmtree(destination_repertoire)
        os.makedirs(destination_repertoire)

        # Parcours de tous les éléments à la racine du dossier source.
        for item in os.listdir(source_repertoire):
            # Si l'élément est dans notre liste d'ignorés, on passe au suivant.
            if item in elements_a_ignorer:
                print(f"🚫 Ignoré : {item}")
                continue

            source_item_path = os.path.join(source_repertoire, item)
            destination_item_path = os.path.join(destination_repertoire, item)

            # S'il s'agit d'un dossier, on le copie entièrement.
            if os.path.isdir(source_item_path):
                shutil.copytree(source_item_path, destination_item_path)
                print(f"📁 Dossier copié : {item}")
            # Sinon, c'est un fichier, on le copie.
            else:
                shutil.copy2(source_item_path, destination_item_path)
                print(f"📄 Fichier copié : {item}")

        print("-" * 30)
        print(f"✅ Copie terminée avec succès dans '{destination_repertoire}'")

    except Exception as e:
        print(f"❌ Une erreur est survenue : {e}")


# --- Exécution du script ---
if __name__ == "__main__":
    copie_projet_filtree()