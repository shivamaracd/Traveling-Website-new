import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Country {
  id: number;
  name: string;
}

export interface State {
  id: number;
  countryId: number;
  name: string;
}

export interface City {
  id: number;
  stateId: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CountryStateCityService {
  private countries: Country[] = [
    { id: 1, name: 'India' }
  ];

  private states: State[] = [
    // India
    { id: 1, countryId: 1, name: 'Maharashtra' },
    { id: 2, countryId: 1, name: 'Delhi' },
    { id: 3, countryId: 1, name: 'Karnataka' },
    { id: 4, countryId: 1, name: 'Tamil Nadu' },
    { id: 5, countryId: 1, name: 'Gujarat' },
    { id: 6, countryId: 1, name: 'Andhra Pradesh' },
    { id: 7, countryId: 1, name: 'Telangana' },
    { id: 8, countryId: 1, name: 'Kerala' },
    { id: 9, countryId: 1, name: 'Uttar Pradesh' },
    { id: 10, countryId: 1, name: 'Madhya Pradesh' },
    { id: 11, countryId: 1, name: 'Rajasthan' },
    { id: 12, countryId: 1, name: 'Bihar' },
    { id: 13, countryId: 1, name: 'West Bengal' },
    { id: 14, countryId: 1, name: 'Punjab' },
    { id: 15, countryId: 1, name: 'Haryana' },
    { id: 16, countryId: 1, name: 'Odisha' },
    { id: 17, countryId: 1, name: 'Assam' },
    { id: 18, countryId: 1, name: 'Jammu and Kashmir' },
    { id: 19, countryId: 1, name: 'Himachal Pradesh' },
    { id: 20, countryId: 1, name: 'Goa' },
    { id: 21, countryId: 1, name: 'Jharkhand' },
    { id: 22, countryId: 1, name: 'Uttarakhand' },
    { id: 23, countryId: 1, name: 'Chhattisgarh' },
    { id: 24, countryId: 1, name: 'Tripura' },
    { id: 25, countryId: 1, name: 'Meghalaya' },
    { id: 26, countryId: 1, name: 'Manipur' },
    { id: 27, countryId: 1, name: 'Nagaland' },
    { id: 28, countryId: 1, name: 'Sikkim' },
    { id: 29, countryId: 1, name: 'Arunachal Pradesh' }
  ];

  private cities: City[] = [
    // Maharashtra
    { id: 1, stateId: 1, name: 'Mumbai' },
    { id: 2, stateId: 1, name: 'Pune' },
    { id: 3, stateId: 1, name: 'Nagpur' },
    { id: 4, stateId: 1, name: 'Thane' },
    { id: 5, stateId: 1, name: 'Nashik' },
    { id: 6, stateId: 1, name: 'Aurangabad' },
    
    // Delhi
    { id: 7, stateId: 2, name: 'New Delhi' },
    { id: 8, stateId: 2, name: 'Noida' },
    { id: 9, stateId: 2, name: 'Gurgaon' },
    { id: 10, stateId: 2, name: 'Faridabad' },
    
    // Karnataka
    { id: 11, stateId: 3, name: 'Bengaluru' },
    { id: 12, stateId: 3, name: 'Mysore' },
    { id: 13, stateId: 3, name: 'Hubli' },
    { id: 14, stateId: 3, name: 'Mangalore' },
    { id: 15, stateId: 3, name: 'Belgaum' },
    
    // Tamil Nadu
    { id: 16, stateId: 4, name: 'Chennai' },
    { id: 17, stateId: 4, name: 'Coimbatore' },
    { id: 18, stateId: 4, name: 'Madurai' },
    { id: 19, stateId: 4, name: 'Tiruchirappalli' },
    { id: 20, stateId: 4, name: 'Salem' },
    
    // Gujarat
    { id: 21, stateId: 5, name: 'Ahmedabad' },
    { id: 22, stateId: 5, name: 'Surat' },
    { id: 23, stateId: 5, name: 'Vadodara' },
    { id: 24, stateId: 5, name: 'Rajkot' },
    { id: 25, stateId: 5, name: 'Gandhinagar' },
    
    // Andhra Pradesh
    { id: 26, stateId: 6, name: 'Visakhapatnam' },
    { id: 27, stateId: 6, name: 'Vijayawada' },
    { id: 28, stateId: 6, name: 'Guntur' },
    { id: 29, stateId: 6, name: 'Nellore' },
    
    // Telangana
    { id: 30, stateId: 7, name: 'Hyderabad' },
    { id: 31, stateId: 7, name: 'Warangal' },
    { id: 32, stateId: 7, name: 'Nizamabad' },
    { id: 33, stateId: 7, name: 'Karimnagar' },
    
    // Kerala
    { id: 34, stateId: 8, name: 'Thiruvananthapuram' },
    { id: 35, stateId: 8, name: 'Kochi' },
    { id: 36, stateId: 8, name: 'Kozhikode' },
    { id: 37, stateId: 8, name: 'Thrissur' },
    
    // Uttar Pradesh
    { id: 38, stateId: 9, name: 'Lucknow' },
    { id: 39, stateId: 9, name: 'Kanpur' },
    { id: 40, stateId: 9, name: 'Ghaziabad' },
    { id: 41, stateId: 9, name: 'Agra' },
    { id: 42, stateId: 9, name: 'Varanasi' },
    { id: 43, stateId: 9, name: 'Meerut' },
    
    // Madhya Pradesh
    { id: 44, stateId: 10, name: 'Bhopal' },
    { id: 45, stateId: 10, name: 'Indore' },
    { id: 46, stateId: 10, name: 'Jabalpur' },
    { id: 47, stateId: 10, name: 'Gwalior' },
    
    // Rajasthan
    { id: 48, stateId: 11, name: 'Jaipur' },
    { id: 49, stateId: 11, name: 'Jodhpur' },
    { id: 50, stateId: 11, name: 'Udaipur' },
    { id: 51, stateId: 11, name: 'Kota' },
    
    // Bihar
    { id: 52, stateId: 12, name: 'Patna' },
    { id: 53, stateId: 12, name: 'Gaya' },
    { id: 54, stateId: 12, name: 'Bhagalpur' },
    { id: 55, stateId: 12, name: 'Muzaffarpur' },
    
    // West Bengal
    { id: 56, stateId: 13, name: 'Kolkata' },
    { id: 57, stateId: 13, name: 'Howrah' },
    { id: 58, stateId: 13, name: 'Durgapur' },
    { id: 59, stateId: 13, name: 'Siliguri' },
    
    // Punjab
    { id: 60, stateId: 14, name: 'Ludhiana' },
    { id: 61, stateId: 14, name: 'Amritsar' },
    { id: 62, stateId: 14, name: 'Jalandhar' },
    { id: 63, stateId: 14, name: 'Patiala' },
    
    // Haryana
    { id: 64, stateId: 15, name: 'Faridabad' },
    { id: 65, stateId: 15, name: 'Gurgaon' },
    { id: 66, stateId: 15, name: 'Panipat' },
    { id: 67, stateId: 15, name: 'Ambala' },
    
    // Minimal entries for other states
    { id: 68, stateId: 16, name: 'Bhubaneswar' }, // Odisha
    { id: 69, stateId: 17, name: 'Guwahati' },    // Assam
    { id: 70, stateId: 18, name: 'Srinagar' },    // J&K
    { id: 71, stateId: 19, name: 'Shimla' },      // HP
    { id: 72, stateId: 20, name: 'Panaji' },      // Goa
    { id: 73, stateId: 21, name: 'Ranchi' },      // Jharkhand
    { id: 74, stateId: 22, name: 'Dehradun' },    // Uttarakhand
    { id: 75, stateId: 23, name: 'Raipur' },      // Chhattisgarh
    { id: 76, stateId: 24, name: 'Agartala' },    // Tripura
    { id: 77, stateId: 25, name: 'Shillong' },    // Meghalaya
    { id: 78, stateId: 26, name: 'Imphal' },      // Manipur
    { id: 79, stateId: 27, name: 'Kohima' },      // Nagaland
    { id: 80, stateId: 28, name: 'Gangtok' },     // Sikkim
    { id: 81, stateId: 29, name: 'Itanagar' }     // Arunachal Pradesh
  ];

  constructor() { }

  getCountries(): Observable<Country[]> {
    return of(this.countries);
  }

  getStates(countryId: number): Observable<State[]> {
    return of(this.states.filter(state => state.countryId === countryId));
  }

  getCities(stateId: number): Observable<City[]> {
    return of(this.cities.filter(city => city.stateId === stateId));
  }
} 