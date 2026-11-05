"""Rights/provenance and safe-staging checks; no network requests."""
import importlib.util,json,unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('incompetech',ROOT/'scripts/import-incompetech.py')
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)

class CatalogImportTests(unittest.TestCase):
    def setUp(self):
        self.track={'isrc':'USUAN1200059','filename':'Controlled Chaos.mp3','title':'Controlled Chaos','length':'00:05:52','feel':'Dark, Suspenseful','instruments':'Synths, Percussion','bpm':'80','genre':'10'}

    def test_catalog_has_unique_ids_and_explicit_rights_and_sources(self):
        data=json.loads((ROOT/'docs/audio/incompetech-catalog.json').read_text())
        self.assertEqual(len(data['tracks']),1443)
        self.assertEqual(len({t['isrc'] for t in data['tracks']}),len(data['tracks']))
        for track in data['tracks']:
            self.assertEqual(track['sourceDeclaredLicense'],'CC BY 4.0')
            self.assertEqual(track['licenseUrl'],module.LICENSE)
            self.assertIn(track['title'],track['attribution'])
            self.assertIn('Kevin MacLeod',track['attribution'])
            self.assertIn(track['isrc'],track['sourceUrl'])
            self.assertGreater(track['duration'],0)
        self.assertRegex(data['sourceSha256'],r'^[a-f0-9]{64}$')
        self.assertRegex(data['licenseEvidenceSha256'],r'^[a-f0-9]{64}$')

    def test_original_track_identity_and_duration_are_retained(self):
        normalized=module.normalize(self.track)
        self.assertEqual(normalized['duration'],352)
        self.assertEqual(normalized['title'],'Controlled Chaos')
        self.assertEqual(normalized['isrc'],self.track['isrc'])
        self.assertTrue(normalized['downloadUrl'].endswith('Controlled%20Chaos.mp3'))

    def test_unsafe_or_non_audio_source_names_are_rejected(self):
        for name in ['../secret.mp3','nested/song.mp3','nested\\song.mp3','track.html','']:
            with self.subTest(name=name),self.assertRaises(ValueError):
                module.normalize({**self.track,'filename':name})

    def test_invalid_duration_and_id_are_rejected(self):
        for duration in [None,'unknown','00:90:00','00:00:00']:
            with self.subTest(duration=duration),self.assertRaises(ValueError):
                module.normalize({**self.track,'length':duration})
        with self.assertRaises(ValueError):module.normalize({**self.track,'isrc':'../../outside'})

    def test_missing_optional_mood_metadata_is_supported(self):
        normalized=module.normalize({**self.track,'feel':None,'bpm':None,'instruments':None})
        self.assertEqual(normalized['moods'],[])

    def test_media_staging_is_outside_public_and_ignored(self):
        self.assertTrue(module.STAGING.is_relative_to(ROOT/'.local'))
        self.assertFalse(module.STAGING.is_relative_to(ROOT/'public'))
        self.assertIn('.local/',(ROOT/'.gitignore').read_text())

if __name__=='__main__':unittest.main()
