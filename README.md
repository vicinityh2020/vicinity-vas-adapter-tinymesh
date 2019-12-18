# Repo for Predictive Operations VAS 

## Installation
* `pipenv shell`
* `pipenv install`
* `cd project/frontend` and `npm install`

You also need to set env variables for SMS Key service used for sms notifications.
Insert your key for dashboard in the settings.py.
Also in the `settings.py` you need to configure db connection according to your needs.

### DB Setup
From within `project` folder (the one containing `manage.py`)
* `python manage.py makemigrations` and `python manage.py migrate`
    - This will apply correct db schema
* `python manage.py createsuperuser`
    - This will create the admin user
    
## Running dev environment 
From within `project` folder (the one containing `manage.py`)
* Start django dev server `python manage.py runserver`
* Run npm static server `cd frontend` and then `npm start`
    - npm static server will forward api requests to the django backend