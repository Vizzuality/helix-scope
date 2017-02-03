from __future__ import print_function, division
import argparse
import pprint
from colorama import Fore, Back, Style
from netCDF4 import Dataset
import numpy as np
import rasterio
import os, fnmatch, zipfile, shutil

# --- COMMAND LINE PARSER ---
parser = argparse.ArgumentParser(description='When passed a folder, this program will produce a geotiff for each .ns file inside.')
parser.add_argument('src_folder', help = 'A path to src folder <path>')
parser.add_argument('dst_folder', help = 'A path to dst folder <path>')
args = parser.parse_args()


# find all files ending in name in directory
def find_files(directory, name):
  paths = []
  for root, dirs, files in os.walk(directory):
    for basename in files:
      if fnmatch.fnmatch(basename, name):
        filesource = os.path.join(root, basename)
        base_prnt = root.rsplit('/', 1)[-1]
        # To be assigned when we know our naming structure
        # filename = get_filename(base_prnt)
        filename = basename
        item = [filename, filesource]
        if len(item) > 0:
          paths.append(item)
  # print(paths)
  return paths


# Decide what each file should be called in dst
def get_filename(base_prnt):
    indicator = base_prnt[0:2]
    scenario = base_prnt[3:7]
    season = base_prnt[2]
    measurement = base_prnt[7:]

    for ind in indicators:
        if ind[0] == indicator:
            indicator = ind[1]

    for scen in scenarios:
        if scen[0] == scenario:
            scenario = scen[1]

    filename = indicator + "_" + measurement + "_" + scenario + "_" + season

    return filename


# load files paths and capture data
def load_files(paths):
  ensure_dir(args.dst_folder)
  for fname in paths:
    tiff_fname = fname[0].split("/")[-1][:-3] + ".tif"  # extract a filename from input path/file
    nc = Dataset(fname[1])
    convert_file(fname, nc, tiff_fname)


# convert that file and put it back where you got it from, son
def convert_file(fname, data, dst_fname):
    print(Fore.YELLOW + "Processing {0}...".format(fname[0]))

    # If you want to programatically identify a variable in the netcdf with the right number of dimensions:
    # for var in nc.variables:
    #     if len(nc[var].dimensions) ==3:
    #         print(nc[var])
    #         Z = nc[var][0, :, :]

    # Process data
    assert len(data['lat'][:]) == 360, 'Lat wrong size'
    Z = data.variables['gpp'][0, :, :].squeeze()  # Extract the data (one dimension of time, all lat/lon data)
    # Replace missing data with -99 value for geotif
    missing = Z.data == data['gpp']._FillValue  # Identify missing values
    Z.data[missing] = -99
    south_lat = data['lat'][-1] + 0.25  # Change pos.to edges of pxls (not center)
    north_lat = data['lat'][0] - 0.25
    num_lats = len(data['lat'])
    west_lon = data['lon'][0] - 0.25
    east_lon = data['lon'][-1] + 0.25
    num_lons = len(data['lon'])
    # Rasterio needs to transform the data
    x = np.linspace(west_lon, east_lon, num_lons)
    y = np.linspace(south_lat, north_lat, num_lats)
    X, Y = np.meshgrid(x, y)
    transform = rasterio.transform.from_bounds(west_lon, south_lat, east_lon, north_lat, Z.shape[1], Z.shape[0])

    # Create new file object, save the array to it, and close the conn.
    dst_path = args.dst_folder + '/' + dst_fname
    new_dataset = rasterio.open(dst_path, 'w',
      driver='GTiff',
      height=Z.shape[0],
      width=Z.shape[1],
      count=1,
      dtype=Z.dtype,
      crs='EPSG:4326',
      transform=transform,
      compress='lzw',
      nodata=-99.,
      bigtiff='NO')
    new_dataset.write(Z, 1)
    new_dataset.close()
    print(Fore.GREEN + "Success. Created {0}".format(dst_fname))


#ensure directory
def ensure_dir(f):
  if not os.path.exists(f):
    os.mkdir(f)


# party time
if __name__ == "__main__":

    # check if dst folder already exists
    if os.path.exists(args.dst_folder):
        shutil.rmtree(args.dst_folder)

    # find all dem files, son
    paths = find_files(args.src_folder, '*.nc')

    # lets load file meta into an array
    load_files(paths)
    #
    # # zips them all to upload them to carto
    # zip_files(cwd)
