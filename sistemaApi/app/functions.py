import uuid

def send_success(message, data = None):
    data = {
        'estado': 1,
        'mensaje': message,
        'datos': data
    }
    return data

def send_warning(message):
    data = {
        'estado': 0,
        'mensaje': message,
    }
    return data

def send_error():
    data = {
        'estado': 0,
        'mensaje': 'Ocurrió un error interno en el servidor',
    }
    return data

def convert_to_duration(seconds):
    hours = seconds // 3600
    seconds %= 3600
    minutes = seconds // 60
    seconds %= 60
    duration = ""
    if hours > 0:
        duration = str(int(hours)) + ":" + str(int(minutes)) + ":" + str(int(seconds))
    else:
        duration = str(int(minutes)) + ":" + str(int(seconds))
        
    return duration

def generate_uuiid(limit = 8):
    random = str(uuid.uuid4())
    random = random.upper()
    random = random.replace("-","")
    return random[0:limit]