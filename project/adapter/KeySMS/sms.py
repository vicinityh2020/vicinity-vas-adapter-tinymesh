# KeySMS API client.
# Based upon the Java api.
import hashlib
from json import JSONEncoder, JSONDecoder
from urllib.parse import urlencode
from urllib.request import urlopen


class KeySMS(object):
    options = {}
    message = ''

    def __init__(self):
        """
        Constructor, defines what address to connect to and other options
        @param array $options The API wide options
        """
        self.options = {
            "host": "app.keysms.no",
            "scheme": "http"
        }

    def auth(self, user_name, api_key):
        " Define what user to auth with. All actions taken will be tied to this user in KeySMS "

        auth = {"username": user_name,
                "apiKey": api_key}
        self.options['auth'] = auth

    def sms(self, message, receivers, date=None, time=None):
        """ Send an SMS some time in the future (or right now if you don't specify)
        Returns a dist with the response from the KeySMS service """

        self.message = message
        response = self._call("/messages", receivers, date, time)

        response_json = JSONDecoder().decode(response)
        return response_json

    def _call(self, input_url, receivers, date, time):
        """ Abstracts making HTTP calls """

        json_payload = JSONEncoder().encode({
            'message': self.message,
            'receivers': receivers,
            'date': date,
            'time': time
        }
        )

        host = self.options['host']
        scheme = self.options['scheme']
        request_url = f"{scheme}://{host}{input_url}"
        signature = self.sign(json_payload)
        username = self.options['auth']['username']

        data = urlencode([('payload', json_payload),
                          ('signature', signature),
                          ('username', username)])
        data = data.encode('utf-8')
        conn = urlopen(request_url, data)
        resp = conn.readlines()
        resp = resp[0].decode('utf-8')
        return resp

    def sign(self, json):
        """
        Create completely sign string based on payload

        @param array $payload The complete payload to ship
        @return string Ready to use sign string, just include in request
        """

        string_to_encode = json + self.options['auth']['apiKey']
        string_to_encode = string_to_encode.encode('utf-8')

        md5engine = hashlib.md5()
        md5engine.update(string_to_encode)

        hashtext = ''.join(['0' for x in range(32 - len(md5engine.hexdigest()))])
        hashtext += md5engine.hexdigest()
        return hashtext
