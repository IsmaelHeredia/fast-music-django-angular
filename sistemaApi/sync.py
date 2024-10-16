#!/usr/bin/python3
# pip install PyDrive
# client_secrets.json
# Written by Ismael Heredia

from pydrive.drive import GoogleDrive 
from pydrive.auth import GoogleAuth

import argparse
import os, hashlib, shutil

import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistemaApi.settings')
django.setup()

from app.models import Config, SyncLog

drive = None

tree_gd = []
tree_folders_gd = []

config = Config.objects.get(pk = 1)
folder_pc = config.song_directory
folder_gd_music = config.song_directory_gd

id_sync_bd = None

def update_logs(logs = None, status = 0):
    try:
        syncLog = SyncLog.objects.get(pk = id_sync_bd)
        syncLog.logs = logs
        syncLog.status = status
        syncLog.save()
    except:
        print("\n[+] Error updating logs in server")

def getIdByFolderName(name):
    global tree_folders_gd
    for file_gd in tree_folders_gd:
        check_name = file_gd["name"]
        if name == check_name:
            return file_gd["id"]
    return None

def filterLocalFilesFolder(folder):
    result = []
    folder_path = folder_pc + "/" + folder
    if os.path.isdir(folder_path):
        files = os.listdir(folder_path)    
        for file in files:
            fullpath = folder_path + "/" + file
            if os.path.isfile(fullpath):
                result.append(file)
    return result

def filterFolders():
    global tree_folders_gd
    result = []
    for file_gd in tree_folders_gd:
        folder = file_gd["name"]
        if folder not in result:
            result.append(folder)
    return result

def filterFilesFolder(folder):
    global tree_gd
    result = []
    for file_gd in tree_gd:
        if file_gd["folder"] == folder:
            result.append(file_gd)
    return result
            
def get_folder_id_by_name(folder_name):
    global drive
    files = drive.ListFile({"q": "title='" + folder_name + "' and mimeType='application/vnd.google-apps.folder' and trashed=false"}).GetList()
    if files != []:
        id_found = files[0]["id"]
        return id_found

def getMD5File(filename):
    with open(filename, "rb") as file_to_check:
        data = file_to_check.read()    
        md5_returned = hashlib.md5(data).hexdigest()
        return md5_returned

def downloadFile(id_drive, file, filename, md5):
    global drive
    
    print("\n[+] Downloading file : %s - %s" % (id_drive,file))
    update_logs("Descargando archivo : " + file)
            
    try:                
        if os.path.isfile(filename):
            md5_file_pc = getMD5File(filename)
            print("[+] File Exists : %s - %s" % (md5,md5_file_pc,))
        else:
            archivo = drive.CreateFile({"id": id_drive}) 
            archivo.GetContentFile(filename)
            
            print("[+] Downloaded")
    except:
        print("[-] Error downloading file")
    
def uploadFile(id_folder, fullpath):
    
    global drive
    
    print("\n[+] Uploading file : %s" % (fullpath,))    
    update_logs("Subiendo archivo : " + fullpath)
            
    try:        
        new_file = drive.CreateFile({'parents': [{"kind": "drive#fileLink", "id": id_folder}]})
        new_file['title'] = fullpath.split("/")[-1]
        new_file.SetContentFile(fullpath)
        
        new_file.Upload()
        
        print("[+] File uploaded with ID %s" % (new_file["id"],))
        
        return new_file["id"]
    
    except:
        print("[-] Error uploading file")
        
        return None
    
def makeFolderDrive(id_folder_gd, folder):
    
    global drive
    
    print("\n[+] Creating new folder %s" % (folder,))
    update_logs("Creando nueva carpeta con nombre " + folder)
    
    try:
        new_folder = drive.CreateFile({
        'title': folder,
        'mimeType': 'application/vnd.google-apps.folder',
        'parents': [{"kind": "drive#fileLink", "id": id_folder_gd }]})
        
        new_folder.Upload()
                                    
        print("[+] Folder created with ID %s" % (new_folder["id"],))
        
        return new_folder["id"]
    except:
        print("[-] Error creating folder")
        return None

def deleteFileGD(id_file,filename):
    global drive
    
    print("\n[+] Deleting file : %s" % (filename,))
    update_logs("Borrando archivo : " + filename)
    
    try:
        delete_file = drive.CreateFile({"id": id_file})
        
        delete_file.Trash()
        delete_file.UnTrash()
        delete_file.Delete()
        
        print("[+] File deleted")

    except:
        print("[-] Error deleting file")
        
def deleteFolderGD(id_folder,folder_name):
    global drive
    
    print("\n[+] Deleting folder : %s" % (folder_name,))
    update_logs("Borrando carpeta con nombre : " + folder_name)
    
    try:
        delete_file = drive.CreateFile({"id": id_folder})
        
        delete_file.Trash()
        delete_file.UnTrash()
        delete_file.Delete()
        
        print("[+] Folder deleted")

    except:
        print("[-] Error deleting folder")

def list_folder_gd(folder_id = None, folder_name = None):
    
    global drive, tree_gd
    
    update_logs("Leyendo directorios y archivos de Google Drive ...")
    
    query = ""
    
    if folder_id is None:
        query = "'root' in parents and trashed=false"
    else:
        query = "'" + str(folder_id) + "' in parents and trashed=false"
 
    try:
        file_list = drive.ListFile({"q": query, 'fields': 'items(id, title, mimeType, md5Checksum)' }).GetList()
        
        files = []
        folders = []
            
        for file in file_list:
            
            #print(file)
            id_drive = file["id"]
            title = file["title"]
            mimeType = file["mimeType"]
            md5 = ""
            
            if "md5Checksum" in file:
                md5 = file['md5Checksum']
            if mimeType == "application/vnd.google-apps.folder":
                folders.append({ "id" : id_drive, "name" : title })
                if not any(d['name'] == title for d in tree_folders_gd):
                    tree_folders_gd.append({ "id" : id_drive, "name" : title })
                #print("[+] Folder : %s" % (title,))
            else:
                files.append({ "id" : id_drive, "name" : title })
                tree_gd.append({ "id": id_drive, "folder": folder_name, "file": title, "md5": md5 })
                #print("[+] File : %s" % (title,))
                
        for folder in folders:
            list_folder_gd(folder["id"],folder["name"])
            
    except:
        print("[-] Error reading folder %s" % (folder["name"],))
        
def sync_from_drive():
    
    global drive, folder_pc, folder_gd_music
    
    id_folder_gd = get_folder_id_by_name(folder_gd_music)
    
    print("\n[+] Reading folder %s ..." % (folder_pc,))
    
    update_logs("Leyendo carpeta local " + folder_pc + " ...")
    
    list_folder_gd(id_folder_gd)
    
    print("\n[+] Cleaning folders\n")
    
    folders = []
    
    for folder_gd in tree_gd:
        folders.append(folder_gd["folder"])
        
    folders = list(set(folders))
            
    for list_name in os.listdir(folder_pc):
        list_path = os.path.join(folder_pc, list_name)
        folder_path = folder_pc + "/" + list_name
        if os.path.isdir(list_path):
            if list_name not in folders:
                print("[!] Deleting folder : %s" % (folder_path,))
                shutil.rmtree(folder_path)
        else:
            os.remove(folder_path)
                        
    print("\n[+] Cleaning files\n")
        
    for folder in folders:
        if os.path.isdir(folder_pc + "/" + folder):
            files_pc = os.listdir(folder_pc + "/" + folder)
            for file_pc in files_pc:
                file_found = False
                for file_gd in tree_gd:
                    if folder == file_gd["folder"] and file_pc == file_gd["file"]:
                        file_found = True
                if file_found == False:
                    filename_path = folder_pc + "/" + folder + "/" + file_pc
                    print("[!] Deleting file : %s" % (filename_path,))
                    os.remove(filename_path)
                        
    for file_gd in tree_gd:
        
        id_drive = file_gd["id"]
        folder = file_gd["folder"]
        fullpath = folder_pc + "/" + file_gd["folder"]
        file = file_gd["file"]
        md5 = file_gd["md5"]
        
        filename = fullpath + "/" + file
        
        if not os.path.exists(fullpath):
            os.makedirs(fullpath)
            print("\n[+] Creating new directory : %s" % (folder,))
            
        downloadFile(id_drive, file, filename, md5)
        
    update_logs("La sincronización con Google Drive se completó correctamente", 1)
                 
def sync_from_pc():

    global drive, folder_pc, folder_gd_music
    
    id_folder_gd = get_folder_id_by_name(folder_gd_music)
    
    print("\n[+] Reading folder %s ..." % (folder_pc,))
    
    update_logs("Leyendo carpeta local " + folder_pc + " ...", 0)
        
    list_folder_gd(id_folder_gd)
            
    folders = []
    
    for list_name in os.listdir(folder_pc):
        list_path = os.path.join(folder_pc, list_name)
        if os.path.isdir(list_path):
            folders.append(list_name)
                        
    folders = list(set(folders))

    # No existe nada, se crea todo desde cero
    
    if not tree_gd:
        
        for folder in folders:
            
            folders_gd = []
            
            files = os.listdir(folder_pc + "/" + folder)
            
            for file in files:
            
                fullpath = folder_pc + "/" + folder + "/" + file
            
                if not any(d['name'] == folder for d in folders_gd):
                    
                    new_id_folder = makeFolderDrive(id_folder_gd, folder)
                                        
                    folders_gd.append({ "id": new_id_folder, "name" : folder })
                                                                    
                id_folder = next(filter(lambda x: x['name'] == folder,folders_gd))["id"]
            
                uploadFile(id_folder, fullpath)
 
    # Si existe, se sincroniza
    
    if tree_gd:
        
        folders_gd = filterFolders()
                
        # Se limpian carpetas que no existan en la nube pero si en la pc
        
        folders_deleted = []
        
        for folder_gd in folders_gd:
            if folder_gd not in folders:
                id_folder = getIdByFolderName(folder_gd)
                deleteFolderGD(id_folder,folder_gd)
                folders_deleted.append(folder_gd)
        
        # Se borran los archivos que no existen en la nube pero si en la pc
        
        for folder_gd in folders_gd:
            if folder_gd not in folders_deleted:
                local_files = filterLocalFilesFolder(folder_gd)
                files_gd = filterFilesFolder(folder_gd)
                for file_gd in files_gd:
                    id_drive = file_gd["id"]
                    filename = file_gd["file"]
                    if filename not in local_files:
                        #print("[+] Deleting file %s in folder %s" % (filename,folder_gd))
                        deleteFileGD(id_drive,filename)
        
        # Se sincronizan los directorios y archivos con la nube    
        
        for folder in folders:
            
            if folder not in folders_gd:
                #print("NO existe el directorio %s" % (folder,))
                new_id_folder = makeFolderDrive(id_folder_gd, folder)
                tree_folders_gd.append({ "id" : new_id_folder, "name" : folder })
                
            id_folder = getIdByFolderName(folder)
            
            files_gd = filterFilesFolder(folder)
                        
            files = os.listdir(folder_pc + "/" + folder)
            
            for file in files:
            
                fullpath = folder_pc + "/" + folder + "/" + file
                
                md5_file_pc = getMD5File(fullpath)
                
                fileFound = False
                
                for file_gd in files_gd:
                    id_drive = file_gd["id"]
                    folder_gd = file_gd["folder"]
                    filename_gd = file_gd["file"]
                    md5_gd = file_gd["md5"]
                    if filename_gd == file:
                        if(md5_gd == md5_file_pc):
                            print("SI existe el archivo %s en %s" % (file,folder,))
                        else:
                            print("SI existe y es INVALIDO %s en %s" % (file,folder,))
                            deleteFileGD(id_drive,file)
                            uploadFile(id_folder, fullpath)
                            
                        fileFound = True
                        
                if fileFound == False:
                    #print("NO ya existe el archivo %s en %s" % (file,folder,))
                    #print("SE DETECTO %s" % (id_folder,))
                    uploadFile(id_folder, fullpath)
                    
    update_logs("La sincronización local se completó correctamente", 1)
                                                                                                                                                                     
def main():
    
    global drive, id_sync_bd
    
    parser = argparse.ArgumentParser(description='Enter arguments to sync')	
    parser.add_argument("-sync-from-pc", dest='sync_from_pc',action='store_true', help="Sync from PC")
    parser.add_argument("-sync-from-drive", dest='sync_from_drive',action='store_true', help="Sync from Drive")
    parser.add_argument("-id-sync", dest='id_sync', help="Enter sync ID")

    results = parser.parse_args()

    op_sync_from_pc = results.sync_from_pc
    op_sync_from_drive = results.sync_from_drive
    op_id_sync = results.id_sync
    
    if op_sync_from_drive == True and op_id_sync is not None:
        
        gauth = GoogleAuth()
        gauth.LocalWebserverAuth()

        drive = GoogleDrive(gauth)
        
        id_sync_bd = op_id_sync
        
        sync_from_drive()
        
    elif op_sync_from_pc == True and op_id_sync is not None:
        
        gauth = GoogleAuth()
        gauth.LocalWebserverAuth()

        drive = GoogleDrive(gauth)
        
        id_sync_bd = op_id_sync
        
        sync_from_pc()
        
    else:
        parser.print_help()

if __name__ == '__main__':
    main()